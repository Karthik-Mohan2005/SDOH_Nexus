import pandas as pd
import joblib

INPUT = r"D:\SDOH-Nexus-main\backend\ml\models\FINAL_INTEGRATED_SDOH_DATASET_CLEAN.csv"

MODEL_FILE = r"D:\SDOH-Nexus-main\backend\ml\scripts\sdoh_catboost_pipeline.pkl"

OUTPUT = r"D:\SDOH-Nexus-main\backend\ml\models\PATIENT_RISK_PREDICTED.csv"
df = pd.read_csv(INPUT)

bundle = joblib.load(MODEL_FILE)

model = bundle['model']
features = bundle['features']
cat_cols = bundle['categorical']

X = df[features].copy()

for col in cat_cols:
    X[col] = X[col].astype(str)
df['Risk_Probability'] = model.predict_proba(X)[:, 1]

def risk_category(prob):

    if prob >= 0.70:
        return 'High'

    elif prob >= 0.40:
        return 'Medium'

    else:
        return 'Low'

df['Risk_Category'] = df['Risk_Probability'].apply(risk_category)

df.to_csv(OUTPUT, index=False)
print("=" * 70)
print("PATIENT RISK PREDICTION COMPLETE")
print("=" * 70)

print(f"Rows processed: {len(df)}")

print("\nRisk distribution:")
print(df['Risk_Category'].value_counts())

print("\nRisk percentages:")
print((df['Risk_Category'].value_counts(normalize=True) * 100).round(2))

print(f"\nSaved to:\n{OUTPUT}")
