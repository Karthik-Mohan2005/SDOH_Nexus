from services.data_service import (
    load_patient_data,
    load_state_risk_data
)
def get_all_communities():
    df = load_state_risk_data()

    records = df.where(
        df.notna(),
        None
    ).to_dict(orient="records")

    return records
def get_community_by_state(state_name):

    df = load_state_risk_data()

    result = df[
        df["State"].astype(str).str.lower()
        == str(state_name).lower()
    ]

    if result.empty:
        return None

    record = result.iloc[0]

    return record.where(
        record.notna(),
        None
    ).to_dict()

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
                (members["Risk_Category"] == "High").sum()
            ),

            "mediumRiskCount": int(
                (members["Risk_Category"] == "Medium").sum()
            ),

            "lowRiskCount": int(
                (members["Risk_Category"] == "Low").sum()
            ),

            "averageRiskProbability": float(
                members["Risk_Probability"].mean()
            )
        })

    return results