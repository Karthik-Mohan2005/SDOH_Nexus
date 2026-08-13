from services.data_service import get_member_by_id

def to_bool(value):
    if value is None:
        return None

    return bool(value)

def build_member_profile(member_id):
    member = get_member_by_id(member_id)

    if member is None:
        return None
    member_info = {
        "id": member.get("Patient_ID"),
        "age": member.get("Age"),
        "gender": member.get("Gender"),
        "race": member.get("Race"),
        "ethnicity": member.get("Ethnicity"),
        "maritalStatus": member.get("Marital_Status"),
        "state": member.get("State"),
        "zip": member.get("ZIP"),
        "fips": member.get("FIPS"),
        "latitude": member.get("Latitude"),
        "longitude": member.get("Longitude"),
        "ageGroup": member.get("Age_Group"),
        "income": member.get("Income"),
        "healthcareCoverage": member.get("Healthcare_Coverage")
    }

    health = {
        "diabetes": to_bool(member.get("Diabetes")),
        "prediabetes": to_bool(member.get("Prediabetes")),
        "hypertension": to_bool(member.get("Hypertension")),
        "heartDisease": to_bool(member.get("Heart_Disease")),
        "copd": to_bool(member.get("COPD")),
        "asthma": to_bool(member.get("Asthma")),
        "kidneyDisease": to_bool(member.get("Kidney_Disease")),
        "cancer": to_bool(member.get("Cancer")),
        "obesity": to_bool(member.get("Obesity")),
        "depression": to_bool(member.get("Depression")),
        "anxiety": to_bool(member.get("Anxiety")),
        "chronicPain": to_bool(member.get("Chronic_Pain")),

        "comorbidityCount": member.get("Comorbidity_Count"),

        "bmi": member.get("BMI"),
        "bmiCategory": member.get("BMI_Category"),

        "systolicBP": member.get("Systolic_BP"),
        "diastolicBP": member.get("Diastolic_BP"),
        "heartRate": member.get("Heart_Rate"),
        "respiratoryRate": member.get("Respiratory_Rate"),

        "glucose": member.get("Glucose"),
        "hba1c": member.get("HbA1c"),
        "creatinine": member.get("Creatinine"),
        "egfr": member.get("eGFR")
    }

    utilization = {
        "totalEncounters": member.get("Total_Encounters"),
        "inpatientVisits": member.get("Inpatient_Visits"),
        "emergencyVisits": member.get("Emergency_Visits"),
        "outpatientVisits": member.get("Outpatient_Visits"),
        "ambulatoryVisits": member.get("Ambulatory_Visits"),
        "urgentCareVisits": member.get("UrgentCare_Visits"),
        "wellnessVisits": member.get("Wellness_Visits"),
        "snfVisits": member.get("SNF_Visits"),
        "hospiceVisits": member.get("Hospice_Visits"),
        "virtualVisits": member.get("Virtual_Visits"),

        "totalHealthcareCost": member.get("Total_Healthcare_Cost"),
        "totalPayerCoverage": member.get("Total_Payer_Coverage"),

        "claimCount": member.get("Claim_Count"),
        "procedureCount": member.get("Procedure_Count"),
        "distinctProcedureCount": member.get(
            "Distinct_Procedure_Count"
        ),
        "distinctDiagnosisCount": member.get(
            "Distinct_Diagnosis_Count"
        )
    }

    medications = {
        "medicationCount": member.get("Medication_Count"),
        "medicationRecordCount": member.get(
            "Medication_Record_Count"
        ),
        "totalDispenses": member.get("Total_Dispenses"),
        "totalCost": member.get("Medication_Total_Cost"),
        "payerCoverage": member.get(
            "Medication_Payer_Coverage"
        )
    }
    sdoh = {
        "svi": {
            "theme1": member.get("RPL_THEME1"),
            "theme2": member.get("RPL_THEME2"),
            "theme3": member.get("RPL_THEME3"),
            "theme4": member.get("RPL_THEME4"),
            "overall": member.get("RPL_THEMES")
        },

        "poverty": member.get("EP_POV150"),
        "unemployment": member.get("EP_UNEMP"),
        "uninsured": member.get("EP_UNINSUR"),
        "noHighSchoolDiploma": member.get("EP_NOHSDP"),
        "disability": member.get("EP_DISABL"),
        "minority": member.get("EP_MINRTY"),
        "noVehicle": member.get("EP_NOVEH")
    }

    environment = {
        "pm25": member.get("EPA_PM25"),
        "ozone": member.get("EPA_OZONE"),
        "dieselPM": member.get("EPA_DIESEL_PM"),
        "cancerRisk": member.get("EPA_CANCER_RISK"),
        "respiratoryHazard": member.get(
            "EPA_RESP_HAZARD"
        ),
        "trafficProximity": member.get(
            "EPA_TRAFFIC_PROXIMITY"
        ),
        "minorityPercentage": member.get(
            "EPA_MINORITY_PCT"
        ),
        "lowIncomePercentage": member.get(
            "EPA_LOWINCOME_PCT"
        ),
        "unemploymentPercentage": member.get(
            "EPA_UNEMPLOYMENT_PCT"
        ),
        "linguisticIsolationPercentage": member.get(
            "EPA_LINGUISTIC_ISOLATION_PCT"
        ),
        "lessHighSchoolPercentage": member.get(
            "EPA_LESS_HS_PCT"
        ),
        "over64Percentage": member.get(
            "EPA_OVER64_PCT"
        ),

        "pm25Percentile": member.get(
            "EPA_PM25_PERCENTILE"
        ),
        "ozonePercentile": member.get(
            "EPA_OZONE_PERCENTILE"
        ),
        "cancerPercentile": member.get(
            "EPA_CANCER_PERCENTILE"
        )
    }
    food_access = {
        "state": member.get("FOOD_STATE"),
        "county": member.get("FOOD_COUNTY"),

        "childPovertyRate": member.get(
            "FOOD_CHILD_POVERTY_RATE21"
        ),

        "childFoodInsecurity": member.get(
            "FOOD_CHILD_FOOD_INSECURITY_20_23"
        ),

        "foodInsecurity": member.get(
            "FOOD_FOOD_INSECURITY_21_23"
        ),

        "deepPovertyRate": member.get(
            "FOOD_DEEP_POVERTY_RATE21"
        ),

        "groceryStoresPer1000": member.get(
            "FOOD_GROCERY_PER_1000"
        ),

        "supermarketsPer1000": member.get(
            "FOOD_SUPERMARKET_PER_1000"
        ),

        "fastFoodPer1000": member.get(
            "FOOD_FASTFOOD_PER_1000"
        ),

        "lowAccessPopulation": member.get(
            "FOOD_LACCESS_POP19"
        ),

        "lowIncomeLowAccess": member.get(
            "FOOD_LACCESS_LOWINCOME19"
        ),

        "lowAccessChildren": member.get(
            "FOOD_LACCESS_CHILD19"
        ),

        "lowAccessSeniors": member.get(
            "FOOD_LACCESS_SENIORS19"
        ),

        "lowAccessSNAP": member.get(
            "FOOD_LACCESS_SNAP19"
        ),

        "medianHouseholdIncome": member.get(
            "FOOD_MEDIAN_HH_INCOME21"
        ),

        "diabetesRate": member.get(
            "FOOD_PCT_DIABETES_ADULTS19"
        ),

        "physicalActivityRate": member.get(
            "FOOD_PCT_PHYSICALLY_ACTIVE21"
        ),

        "snapRate": member.get(
            "FOOD_PCT_SNAP22"
        ),

        "snapStoresPer1000": member.get(
            "FOOD_SNAP_STORES_PER_1000"
        )
    }

    geography = {
        "state": member.get("State"),
        "zip": member.get("ZIP"),
        "fips": member.get("FIPS"),
        "standardFips": member.get("STANDARD_FIPS"),
        "latitude": member.get("Latitude"),
        "longitude": member.get("Longitude")
    }

    risk = {
        "probability": member.get("Risk_Probability"),
        "category": member.get("Risk_Category")
    }

    return {
        "member": member_info,
        "health": health,
        "utilization": utilization,
        "medications": medications,
        "sdoh": sdoh,
        "environment": environment,
        "foodAccess": food_access,
        "geography": geography,
        "risk": risk
    }