from services.data_service import load_patient_data
def get_dashboard_summary():
    df = load_patient_data()

    total_members = len(df)

    high_risk = int(
        (df["Risk_Category"] == "High").sum()
    )

    medium_risk = int(
        (df["Risk_Category"] == "Medium").sum()
    )

    low_risk = int(
        (df["Risk_Category"] == "Low").sum()
    )

    average_risk = float(
        df["Risk_Probability"].mean()
    )

    return {
        "totalMembers": total_members,
        "highRiskMembers": high_risk,
        "mediumRiskMembers": medium_risk,
        "lowRiskMembers": low_risk,
        "averageRiskProbability": average_risk,

        "highRiskPercentage": (
            high_risk / total_members * 100
            if total_members else 0
        ),

        "mediumRiskPercentage": (
            medium_risk / total_members * 100
            if total_members else 0
        ),

        "lowRiskPercentage": (
            low_risk / total_members * 100
            if total_members else 0
        )
    }


def get_risk_distribution():
    df = load_patient_data()

    total = len(df)

    distribution = []

    for category in ["Low", "Medium", "High"]:

        count = int(
            (df["Risk_Category"] == category).sum()
        )

        percentage = (
            count / total * 100
            if total else 0
        )

        distribution.append({
            "category": category,
            "count": count,
            "percentage": percentage
        })

    return distribution

def get_sdoh_factor_analysis():
    df = load_patient_data()

    factors = {
        "poverty": "EP_POV150",
        "unemployment": "EP_UNEMP",
        "uninsured": "EP_UNINSUR",
        "noHighSchoolDiploma": "EP_NOHSDP",
        "disability": "EP_DISABL",
        "minority": "EP_MINRTY",
        "noVehicle": "EP_NOVEH",
        "socialVulnerability": "RPL_THEMES",

        "foodInsecurity": "FOOD_FOOD_INSECURITY_21_23",
        "lowFoodAccess": "FOOD_PCT_LACCESS_POP19",

        "airPollution": "EPA_PM25",
        "ozone": "EPA_OZONE",
        "environmentalCancerRisk": "EPA_CANCER_RISK"
    }

    results = []

    for name, column in factors.items():

        if column not in df.columns:
            continue

        value = df[column].mean()

        results.append({
            "factor": name,
            "sourceColumn": column,
            "average": float(value)
        })

    return results


def get_risk_by_state():

    df = load_patient_data()

    grouped = (
        df.groupby("State")
        .agg(
            totalMembers=("Patient_ID", "count"),
            averageRisk=("Risk_Probability", "mean")
        )
        .reset_index()
    )

    results = []

    for _, row in grouped.iterrows():

        state = row["State"]

        state_df = df[
            df["State"] == state
        ]

        results.append({
            "state": state,
            "totalMembers": int(
                row["totalMembers"]
            ),
            "averageRisk": float(
                row["averageRisk"]
            ),
            "highRisk": int(
                (state_df["Risk_Category"] == "High").sum()
            ),
            "mediumRisk": int(
                (state_df["Risk_Category"] == "Medium").sum()
            ),
            "lowRisk": int(
                (state_df["Risk_Category"] == "Low").sum()
            )
        })

    return results


def get_demographic_summary():

    df = load_patient_data()

    return {
        "gender": (
            df["Gender"]
            .value_counts()
            .to_dict()
        ),

        "ageGroup": (
            df["Age_Group"]
            .value_counts()
            .to_dict()
        ),

        "race": (
            df["Race"]
            .value_counts()
            .to_dict()
        ),

        "ethnicity": (
            df["Ethnicity"]
            .value_counts()
            .to_dict()
        )
    }