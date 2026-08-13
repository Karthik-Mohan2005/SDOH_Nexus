from pathlib import Path
import pandas as pd


# =========================================================
# Paths
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

PATIENT_DATA_PATH = (
    BASE_DIR
    / "ml"
    / "models"
    / "PATIENT_RISK_PREDICTED.csv"
)

STATE_RISK_PATH = (
    BASE_DIR
    / "ml"
    / "models"
    / "STATE_RISK_SUMMARY.csv"
)

FEATURE_IMPORTANCE_PATH = (
    BASE_DIR
    / "ml"
    / "models"
    / "feature_importance.csv"
)


# =========================================================
# Cached datasets
# =========================================================

_patient_df = None
_state_df = None
_feature_importance_df = None


# =========================================================
# Patient dataset
# =========================================================

def load_patient_data():
    """Load and cache the real patient prediction dataset."""

    global _patient_df

    if _patient_df is None:
        if not PATIENT_DATA_PATH.exists():
            raise FileNotFoundError(
                f"Patient dataset not found: {PATIENT_DATA_PATH}"
            )

        _patient_df = pd.read_csv(PATIENT_DATA_PATH)

        _patient_df["Patient_ID"] = (
            _patient_df["Patient_ID"]
            .astype(str)
        )

    return _patient_df


# =========================================================
# State risk dataset
# =========================================================

def load_state_risk_data():
    """Load and cache state-level risk summary."""

    global _state_df

    if _state_df is None:
        if not STATE_RISK_PATH.exists():
            raise FileNotFoundError(
                f"State risk dataset not found: {STATE_RISK_PATH}"
            )

        _state_df = pd.read_csv(STATE_RISK_PATH)

    return _state_df


# =========================================================
# Feature importance
# =========================================================

def load_feature_importance():
    """Load and cache ML feature importance."""

    global _feature_importance_df

    if _feature_importance_df is None:
        if not FEATURE_IMPORTANCE_PATH.exists():
            raise FileNotFoundError(
                f"Feature importance file not found: "
                f"{FEATURE_IMPORTANCE_PATH}"
            )

        _feature_importance_df = pd.read_csv(
            FEATURE_IMPORTANCE_PATH
        )

    return _feature_importance_df


# =========================================================
# Dataset information
# =========================================================

def get_dataset_info():
    """Return information about the real patient dataset."""

    df = load_patient_data()

    return {
        "rows": int(len(df)),
        "columns": int(len(df.columns)),
        "column_names": df.columns.tolist()
    }


# =========================================================
# Get all patients
# =========================================================

def get_all_members():
    """Return all patients as JSON-compatible records."""

    df = load_patient_data()

    records = df.where(
        pd.notnull(df),
        None
    ).to_dict(orient="records")

    return records


# =========================================================
# Get single patient
# =========================================================

def get_member_by_id(member_id):
    """Return one patient using Patient_ID."""

    df = load_patient_data()

    member = df[
        df["Patient_ID"] == str(member_id)
    ]

    if member.empty:
        return None

    record = member.iloc[0]

    record = record.where(
        pd.notnull(record),
        None
    )

    return record.to_dict()


# =========================================================
# Get state information
# =========================================================

def get_all_states():
    """Return all state-level risk summaries."""

    df = load_state_risk_data()

    return df.where(
        pd.notnull(df),
        None
    ).to_dict(orient="records")


# =========================================================
# Get one state
# =========================================================

def get_state_by_name(state_name):
    """Return risk summary for a specific state."""

    df = load_state_risk_data()

    result = df[
        df["State"].astype(str).str.lower()
        == str(state_name).lower()
    ]

    if result.empty:
        return None

    record = result.iloc[0]

    record = record.where(
        pd.notnull(record),
        None
    )

    return record.to_dict()


def get_feature_importance():
    """Return ML feature importance."""

    df = load_feature_importance()

    df = df.sort_values(
        "Importance",
        ascending=False
    )

    return df.where(
        pd.notnull(df),
        None
    ).to_dict(orient="records")

def create_member(member_data):

    global _patient_df

    df = load_patient_data()
    required_fields = [
        "age",
        "gender",
        "race",
        "bmi",
        "systolicBp",
        "diastolicBp",
        "inpatientVisits",
        "urgentCareVisits",
        "standardFips",
        "primaryCondition",
        "communityId",
    ]

    missing = [
        field
        for field in required_fields
        if field not in member_data
    ]

    if missing:
        raise ValueError(
            f"Missing required fields: {', '.join(missing)}"
        )
    community_id = str(
        member_data.get("communityId")
        or member_data.get("standardFips")
    ).strip()

    standard_fips = str(
        member_data.get("standardFips")
        or community_id
    ).strip()

    try:
        fips_int = int(standard_fips)
    except ValueError:
        raise ValueError("Invalid FIPS/community ID")


    community_rows = df[
        (
            df["STANDARD_FIPS"].astype(str) == standard_fips
        )
        |
        (
            df["STANDARD_FIPS"].fillna(-1).astype(int) == fips_int
        )
        |
        (
            df["FIPS"].fillna(-1).astype(int) == fips_int
        )
    ]

    if community_rows.empty:
        raise ValueError(
            f"No existing community found for FIPS {standard_fips}"
        )

    template = community_rows.iloc[0].copy()

    import uuid

    patient_id = str(uuid.uuid4())

    age = float(member_data["age"])
    gender = str(member_data["gender"])
    race = str(member_data["race"])

    template["Patient_ID"] = patient_id
    template["Age"] = age

    if gender == "Male":
        template["Gender"] = "M"
    elif gender == "Female":
        template["Gender"] = "F"
    else:
        template["Gender"] = "O"

    template["Race"] = race
    template["Ethnicity"] = "Non-Hispanic"
    template["Marital_Status"] = "Unknown"


    template["STANDARD_FIPS"] = fips_int
    template["FIPS"] = fips_int

    template["State"] = template["State"]
    template["ZIP"] = template["ZIP"]
    template["Latitude"] = template["Latitude"]
    template["Longitude"] = template["Longitude"]

    bmi = float(member_data["bmi"])
    systolic_bp = float(member_data["systolicBp"])
    diastolic_bp = float(member_data["diastolicBp"])

    template["BMI"] = bmi
    template["Systolic_BP"] = systolic_bp
    template["Diastolic_BP"] = diastolic_bp

    # BMI category
    if bmi < 18.5:
        bmi_category = "Underweight"
    elif bmi < 25:
        bmi_category = "Normal"
    elif bmi < 30:
        bmi_category = "Overweight"
    else:
        bmi_category = "Obese"

    template["BMI_Category"] = bmi_category

    # Age group
    if age < 18:
        age_group = "Child"
    elif age < 45:
        age_group = "Adult"
    elif age < 65:
        age_group = "Middle-aged"
    else:
        age_group = "Senior"

    template["Age_Group"] = age_group

    condition_columns = [
        "Diabetes",
        "Prediabetes",
        "Hypertension",
        "Heart_Disease",
        "COPD",
        "Asthma",
        "Kidney_Disease",
        "Cancer",
        "Obesity",
        "Depression",
        "Anxiety",
        "Chronic_Pain",
    ]

    for column in condition_columns:
        template[column] = 0

    condition_map = {
        "Diabetes": "Diabetes",
        "Hypertension": "Hypertension",
        "COPD": "COPD",
        "Asthma": "Asthma",
        "Heart Disease": "Heart_Disease",
        "Obesity": "Obesity",
        "Chronic Kidney Disease": "Kidney_Disease",
    }

    primary_condition = str(
        member_data["primaryCondition"]
    )

    if primary_condition in condition_map:
        template[condition_map[primary_condition]] = 1

    template["Comorbidity_Count"] = 1

    inpatient_visits = int(
        member_data["inpatientVisits"]
    )

    urgent_care_visits = int(
        member_data["urgentCareVisits"]
    )

    template["Inpatient_Visits"] = inpatient_visits
    template["UrgentCare_Visits"] = urgent_care_visits

    template["Emergency_Visits"] = 0
    template["Outpatient_Visits"] = 0
    template["Ambulatory_Visits"] = 0
    template["Wellness_Visits"] = 0
    template["SNF_Visits"] = 0
    template["Hospice_Visits"] = 0
    template["Virtual_Visits"] = 0

    template["Total_Encounters"] = (
        inpatient_visits + urgent_care_visits
    )

    template["Heart_Rate"] = 75.0
    template["Respiratory_Rate"] = 16.0
    template["Glucose"] = 100.0
    template["HbA1c"] = 5.5
    template["Creatinine"] = 0.8
    template["eGFR"] = 100.0
    template["Medication_Count"] = 0
    template["Medication_Record_Count"] = 0
    template["Total_Dispenses"] = 0
    template["Medication_Total_Cost"] = 0.0
    template["Medication_Payer_Coverage"] = 0.0

    template["Procedure_Count"] = 0
    template["Distinct_Procedure_Count"] = 0
    template["Claim_Count"] = 0
    template["Distinct_Diagnosis_Count"] = 1

    template["Total_Healthcare_Cost"] = 0.0
    template["Total_Payer_Coverage"] = 0.0
    template["Healthcare_Coverage"] = 0.0
    template["Healthcare_Expenses"] = 0.0
    template["Income"] = template.get(
        "FOOD_MEDIAN_HH_INCOME21",
        0
    )

    new_row = pd.DataFrame(
        [template],
        columns=df.columns
    )

    updated_df = pd.concat(
        [df, new_row],
        ignore_index=True
    )

    updated_df.to_csv(
        PATIENT_DATA_PATH,
        index=False
    )

    # Replace cache with the updated dataset
    _patient_df = updated_df

    return (
        new_row.iloc[0]
        .where(pd.notnull(new_row.iloc[0]), None)
        .to_dict()
    )

def update_member_risk(member_id, risk_probability, risk_category):

    global _patient_df

    df = load_patient_data()

    mask = df["Patient_ID"].astype(str) == str(member_id)

    if not mask.any():
        raise ValueError(
            f"Member {member_id} not found"
        )

    df.loc[mask, "Risk_Probability"] = float(
        risk_probability
    )

    df.loc[mask, "Risk_Category"] = str(
        risk_category
    )

    df.to_csv(
        PATIENT_DATA_PATH,
        index=False
    )

    _patient_df = df

    updated = df.loc[mask].iloc[0]

    return (
        updated
        .where(pd.notnull(updated), None)
        .to_dict()
    )