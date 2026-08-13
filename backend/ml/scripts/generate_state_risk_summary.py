import pandas as pd
import numpy as np
INPUT = (
    r"D:\SDOH-Nexus-main\backend\ml\models\PATIENT_RISK_PREDICTED.csv"
)

OUTPUT = (
    r"D:\SDOH-Nexus-main\backend\ml\models\STATE_RISK_SUMMARY.csv"
)

df = pd.read_csv(INPUT)

print("=" * 70)
print("STATE RISK SUMMARY GENERATION")
print("=" * 70)

print(f"Input rows: {len(df)}")

required_cols = ['State', 'Risk_Category']

missing_cols = [c for c in required_cols if c not in df.columns]

if missing_cols:
    raise ValueError(f"Missing required columns: {missing_cols}")

summary = (
    df.groupby(['State', 'Risk_Category'])
      .size()
      .unstack(fill_value=0)
)

for col in ['Low', 'Medium', 'High']:
    if col not in summary.columns:
        summary[col] = 0

summary = summary[['Low', 'Medium', 'High']]

summary['Total_Patients'] = (
    summary['Low'] +
    summary['Medium'] +
    summary['High']
)

summary['Low_Pct'] = (
    summary['Low'] / summary['Total_Patients'] * 100
).round(2)

summary['Medium_Pct'] = (
    summary['Medium'] / summary['Total_Patients'] * 100
).round(2)

summary['High_Pct'] = (
    summary['High'] / summary['Total_Patients'] * 100
).round(2)

summary['State_Risk_Score'] = (
    (
        summary['Low'] * 1 +
        summary['Medium'] * 2 +
        summary['High'] * 3
    ) / summary['Total_Patients']
).round(2)


def classify_state(row):

    score = row['State_Risk_Score']
    high_pct = row['High_Pct']
    if high_pct >= 10:
        return 'High'

    if score < 1.35:
        return 'Low'
    elif score < 1.55:
        return 'Medium'
    else:
        return 'High'
summary['State_Risk_Category'] = (
    summary.apply(classify_state, axis=1)
)

summary = summary.sort_values(
    ['High_Pct', 'State_Risk_Score'],
    ascending=False
)

summary = summary.reset_index()


summary.to_csv(OUTPUT, index=False)

print(f"\nStates processed: {len(summary)}")

print("\nOverall category distribution:")
print(summary['State_Risk_Category'].value_counts())

print("\nTop 10 states by High-Risk percentage:")

print(
    summary[
        [
            'State',
            'Total_Patients',
            'Low',
            'Medium',
            'High',
            'Low_Pct',
            'Medium_Pct',
            'High_Pct',
            'State_Risk_Score',
            'State_Risk_Category'
        ]
    ]
    .head(10)
    .to_string(index=False)
)

print(f"\nSaved to:\n{OUTPUT}")

print("\nSTATE RISK SUMMARY COMPLETED SUCCESSFULLY.")
