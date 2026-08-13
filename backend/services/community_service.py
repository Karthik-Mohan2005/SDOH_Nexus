from services.data_service import (
    load_patient_data,
    load_state_risk_data
)


def _safe_float(value, default=0.0):
    try:
        if value is None:
            return default

        value = float(value)

        if value != value:  # NaN
            return default

        return value
    except (TypeError, ValueError):
        return default


def _safe_int(value, default=0):
    try:
        if value is None:
            return default

        value = float(value)

        if value != value:
            return default

        return int(value)
    except (TypeError, ValueError):
        return default


def _food_access(row):
    """
    Derive a simple food-access classification from the
    real USDA Food Access Research Atlas fields already
    present in the dataset.
    """

    food_insecurity = _safe_float(
        row.get("FOOD_FOOD_INSECURITY_21_23")
    )

    low_access_population = _safe_float(
        row.get("FOOD_PCT_LACCESS_POP19")
    )

    grocery_stores = _safe_float(
        row.get("FOOD_GROCERY_PER_1000")
    )

    score = 0

    if food_insecurity >= 15:
        score += 2
    elif food_insecurity >= 10:
        score += 1

    if low_access_population >= 50:
        score += 2
    elif low_access_population >= 30:
        score += 1

    if grocery_stores <= 0.10:
        score += 2
    elif grocery_stores <= 0.25:
        score += 1

    if score >= 5:
        return "Very Poor"
    elif score >= 3:
        return "Poor"
    elif score >= 1:
        return "Moderate"

    return "Good"


def _environmental_risk(row):
    """
    Derive environmental burden from the EPA fields already
    present in the dataset.
    """

    pm25 = _safe_float(row.get("EPA_PM25_PERCENTILE"))
    ozone = _safe_float(row.get("EPA_OZONE_PERCENTILE"))
    cancer = _safe_float(row.get("EPA_CANCER_PERCENTILE"))

    burden = (pm25 + ozone + cancer) / 3

    if burden >= 75:
        return "Very High"

    if burden >= 50:
        return "High"

    if burden >= 25:
        return "Moderate"

    return "Low"


def _community_from_row(
    row,
    state_stats=None
):
    """
    Convert one real patient/community row into the
    frontend Community shape.
    """

    fips = _safe_int(
        row.get("STANDARD_FIPS")
        or row.get("FIPS")
    )

    state = str(
        row.get("State") or ""
    )

    county = str(
        row.get("FOOD_COUNTY") or ""
    )

    latitude = _safe_float(
        row.get("Latitude")
    )

    longitude = _safe_float(
        row.get("Longitude")
    )

    svi = _safe_float(
        row.get("RPL_THEMES")
    )

    poverty = _safe_float(
        row.get("EP_POV150")
    )

    unemployment = _safe_float(
        row.get("EP_UNEMP")
    )

    median_income = _safe_float(
        row.get("FOOD_MEDIAN_HH_INCOME21")
    )

    environmental_burden = (
        _safe_float(row.get("EPA_PM25_PERCENTILE"))
        + _safe_float(row.get("EPA_OZONE_PERCENTILE"))
        + _safe_float(row.get("EPA_CANCER_PERCENTILE"))
    ) / 3

    food_access = _food_access(row)
    environmental_risk = _environmental_risk(row)

    if state_stats is None:
        state_stats = {}

    total_members = _safe_int(
        state_stats.get("Total_Patients")
    )

    high_risk = _safe_int(
        state_stats.get("High")
    )

    state_risk_category = str(
        state_stats.get(
            "State_Risk_Category",
            "Low"
        )
    )

    if state_risk_category == "High":
        risk_level = "high"
    elif state_risk_category == "Medium":
        risk_level = "moderate"
    else:
        risk_level = "low"

    sdoh_score = round(
        svi * 100,
        1
    )

    hospitalization_risk = round(
        _safe_float(
            state_stats.get(
                "State_Risk_Score"
            )
        ) * 100,
        1
    )

    if high_risk > 0 and total_members > 0:
        priority = "High"
    elif sdoh_score >= 75:
        priority = "High"
    elif sdoh_score >= 50:
        priority = "Moderate"
    else:
        priority = "Low"

    return {
        "communityId": str(fips),
        "name": (
            f"{county}, {state}"
            if county
            else state
        ),
        "fips": str(fips).zfill(5),
        "state": state,
        "county": county,
        "latitude": latitude,
        "longitude": longitude,

        # Dataset does not contain true community population.
        # We therefore use member count rather than inventing
        # a census population.
        "population": total_members,

        "svi": svi,
        "sdohScore": sdoh_score,

        "povertyRate": poverty,
        "unemploymentRate": unemployment,
        "medianHouseholdIncome": median_income,

        "foodAccess": food_access,

        # 0-100 derived score where higher means worse access.
        "foodAccessScore": round(
            min(
                100,
                (
                    _safe_float(
                        row.get(
                            "FOOD_FOOD_INSECURITY_21_23"
                        )
                    ) * 4
                    +
                    _safe_float(
                        row.get(
                            "FOOD_PCT_LACCESS_POP19"
                        )
                    )
                ) / 2
            ),
            1
        ),

        "environmentalRisk": environmental_risk,

        "environmentalBurden": round(
            environmental_burden,
            1
        ),

        # No direct healthcare-access metric exists in the
        # supplied dataset, so derive it from utilization.
        "healthcareAccess": (
            "Good"
            if _safe_float(
                row.get("Total_Encounters")
            ) > 10
            else "Limited"
        ),

        "healthcareAccessScore": round(
            min(
                100,
                _safe_float(
                    row.get("Total_Encounters")
                ) * 5
            ),
            1
        ),

        "highRiskMembers": high_risk,
        "totalMembers": total_members,

        "hospitalizationRisk": hospitalization_risk,

        "priority": priority,

        "riskLevel": risk_level,

        "primaryRisk": (
            "High Social Vulnerability"
            if sdoh_score >= 70
            else "Elevated SDOH Risk"
            if sdoh_score >= 50
            else "Lower SDOH Risk"
        )
    }


def get_all_communities():

    patient_df = load_patient_data()
    state_df = load_state_risk_data()

    # Build state → risk statistics lookup.
    state_stats = {}

    for _, row in state_df.iterrows():
        state_name = str(
            row.get("State") or ""
        ).strip().lower()

        state_stats[state_name] = (
            row.where(
                row.notna(),
                None
            ).to_dict()
        )

    # One real geographic FIPS/community.
    # Use the first patient row as the representative
    # SDOH/geographic record for that FIPS.
    results = []

    grouped = patient_df.groupby(
        "STANDARD_FIPS",
        dropna=True
    )

    for fips, group in grouped:

        if group.empty:
            continue

        row = group.iloc[0]

        state_name = str(
            row.get("State") or ""
        ).strip().lower()

        community = _community_from_row(
            row,
            state_stats.get(
                state_name,
                {}
            )
        )

        # Replace population with the actual number of
        # members represented by this FIPS.
        community["population"] = int(
            len(group)
        )

        # Calculate risk counts specifically for this FIPS.
        community["totalMembers"] = int(
            len(group)
        )

        community["highRiskMembers"] = int(
            (
                group["Risk_Category"]
                == "High"
            ).sum()
        )

        community["hospitalizationRisk"] = round(
            _safe_float(
                group["Risk_Probability"].mean()
            ) * 100,
            1
        )

        results.append(
            community
        )

    return results


def get_community_by_state(state_name):

    communities = get_all_communities()

    matching = [
        community
        for community in communities
        if str(
            community.get("state", "")
        ).lower()
        == str(state_name).lower()
    ]

    if not matching:
        return None

    # Return the highest-priority/highest-SDOH
    # community for the requested state.
    matching.sort(
        key=lambda x: (
            x.get("sdohScore", 0),
            x.get("highRiskMembers", 0)
        ),
        reverse=True
    )

    return matching[0]


def get_community_member_statistics(state_name):

    df = load_patient_data()

    result = df[
        df["State"].astype(str).str.lower()
        == str(state_name).lower()
    ]

    if result.empty:
        return None

    total_members = len(result)

    high_risk = int(
        (result["Risk_Category"] == "High").sum()
    )

    medium_risk = int(
        (result["Risk_Category"] == "Medium").sum()
    )

    low_risk = int(
        (result["Risk_Category"] == "Low").sum()
    )

    average_risk = float(
        result["Risk_Probability"].mean()
    )

    return {
        "state": state_name,
        "totalMembers": total_members,
        "highRiskMembers": high_risk,
        "mediumRiskMembers": medium_risk,
        "lowRiskMembers": low_risk,
        "averageRiskProbability": average_risk
    }


def get_map_data():

    state_df = load_state_risk_data()
    patient_df = load_patient_data()

    results = []

    for _, state in state_df.iterrows():

        state_name = state.get("State")

        members = patient_df[
            patient_df["State"].astype(str).str.lower()
            == str(state_name).lower()
        ]

        if members.empty:
            continue

        results.append({
            "state": state_name,

            "latitude": float(
                members["Latitude"].mean()
            ),

            "longitude": float(
                members["Longitude"].mean()
            ),

            "memberCount": int(
                len(members)
            ),

            "highRiskCount": int(
                (
                    members["Risk_Category"]
                    == "High"
                ).sum()
            ),

            "mediumRiskCount": int(
                (
                    members["Risk_Category"]
                    == "Medium"
                ).sum()
            ),

            "lowRiskCount": int(
                (
                    members["Risk_Category"]
                    == "Low"
                ).sum()
            ),

            "averageRiskProbability": float(
                members["Risk_Probability"].mean()
            )
        })

    return results