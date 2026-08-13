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


# =========================================================
# Feature importance
# =========================================================

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