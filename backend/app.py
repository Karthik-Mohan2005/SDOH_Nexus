from flask import Flask, request, jsonify
from services.member_service import build_member_profile
from services.data_service import (
    get_all_members,
    get_member_by_id,
    get_dataset_info,
    create_member,
    update_member_risk
)
from services.community_service import (
    get_all_communities,
    get_community_by_state,
    get_community_member_statistics,
    get_map_data
)
from services.analytics_service import (
    get_dashboard_summary,
    get_risk_distribution,
    get_sdoh_factor_analysis,
    get_risk_by_state,
    get_demographic_summary
)
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os
from pathlib import Path
import logging
app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = os.getenv(
    'MODEL_PATH',
    str(BASE_DIR / 'ml' / 'scripts' / 'sdoh_catboost_pipeline.pkl')
)
model_bundle = None
model = None
features = None
categorical_cols = None

def load_model():
    """Load the trained model bundle"""
    global model_bundle, model, features, categorical_cols
    
    try:
        if not os.path.exists(MODEL_PATH):
            logger.warning(f"Model file not found at {MODEL_PATH}")
            return False
        
        model_bundle = joblib.load(MODEL_PATH)
        model = model_bundle['model']
        features = model_bundle['features']
        categorical_cols = model_bundle.get('categorical', [])
        
        logger.info(f"Model loaded successfully. Features: {len(features)}")
        logger.info(f"Categorical columns: {len(categorical_cols)}")
        return True
    except Exception as e:
        logger.error(f"Failed to load model: {str(e)}")
        return False

def risk_category(prob):
    if prob >= 0.70:
        return 'High'
    elif prob >= 0.40:
        return 'Medium'
    else:
        return 'Low'
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    }), 200
@app.route('/api/predict', methods=['POST'])
def predict():

    try:
        if model is None:
            return jsonify({
                'error': 'Model not loaded'
            }), 503
        
        data = request.get_json()
        
        if not data or 'patient_data' not in data:
            return jsonify({
                'error': 'Missing patient_data in request'
            }), 400
        
        patient_data = data['patient_data']
        df = pd.DataFrame([patient_data])
        for feature in features:
            if feature not in df.columns:
                df[feature] = 0
        X = df[features].copy()
        for col in categorical_cols:
            if col in X.columns:
                X[col] = X[col].astype(str)
        risk_probability = model.predict_proba(X)[0][1]
        risk_cat = risk_category(risk_probability)
        
        return jsonify({
            'success': True,
            'risk_probability': float(risk_probability),
            'risk_category': risk_cat,
            'patient_id': patient_data.get('patient_id', 'unknown')
        }), 200
    
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({
            'error': f'Prediction failed: {str(e)}'
        }), 500

@app.route('/api/predict-batch', methods=['POST'])
def predict_batch():
    try:
        if model is None:
            return jsonify({
                'error': 'Model not loaded'
            }), 503
        
        data = request.get_json()
        
        if not data or 'patients' not in data:
            return jsonify({
                'error': 'Missing patients in request'
            }), 400
        
        patients = data['patients']
        df = pd.DataFrame(patients)
        for feature in features:
            if feature not in df.columns:
                df[feature] = 0
        X = df[features].copy()
        for col in categorical_cols:
            if col in X.columns:
                X[col] = X[col].astype(str)
        risk_probabilities = model.predict_proba(X)[:, 1]
        results = []
        for i, prob in enumerate(risk_probabilities):
            results.append({
                'patient_id': patients[i].get('patient_id', f'patient_{i}'),
                'risk_probability': float(prob),
                'risk_category': risk_category(prob)
            })
        
        return jsonify({
            'success': True,
            'predictions': results,
            'total': len(results)
        }), 200
    
    except Exception as e:
        logger.error(f"Batch prediction error: {str(e)}")
        return jsonify({
            'error': f'Batch prediction failed: {str(e)}'
        }), 500

@app.route('/api/model-info', methods=['GET'])
def model_info():
    """Get information about the loaded model"""
    if model is None:
        return jsonify({
            'error': 'Model not loaded'
        }), 503
    
    return jsonify({
        'model_loaded': True,
        'num_features': len(features),
        'features': features,
        'categorical_features': categorical_cols,
        'risk_thresholds': {
            'high': 0.70,
            'medium': 0.40,
            'low': 0.0
        }
    }), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Internal server error'}), 500
@app.before_request
def before_request():
    """Load model on first request if not already loaded"""
    global model
    if model is None:
        load_model()

@app.route('/api/members', methods=['GET'])
def api_get_members():
    try:
        members = get_all_members()
        search = request.args.get('search', '').strip().lower()
        state = request.args.get('state', '').strip().lower()
        risk = request.args.get('risk', '').strip().lower()

        if search:
            members = [
                member
                for member in members
                if (
                    search in str(member.get('Patient_ID', '')).lower()
                    or search in str(member.get('ZIP', '')).lower()
                    or search in str(member.get('State', '')).lower()
                )
            ]

        if state:
            members = [
                member
                for member in members
                if str(member.get('State', '')).lower() == state
            ]

        if risk:
            members = [
                member
                for member in members
                if str(member.get('Risk_Category', '')).lower() == risk
            ]

        return jsonify({
            'success': True,
            'count': len(members),
            'data': members
        })

    except Exception as e:
        logger.exception("Failed to retrieve members")

        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/members', methods=['POST'])
def api_create_member():
    try:
        if model is None:
            return jsonify({
                'success': False,
                'error': 'Model not loaded'
            }), 503

        data = request.get_json(silent=True)

        if not data:
            return jsonify({
                'success': False,
                'error': 'Request body is required'
            }), 400

        new_member = create_member(data)

        prediction_df = pd.DataFrame([new_member])

        for feature in features:
            if feature not in prediction_df.columns:
                prediction_df[feature] = 0

        X = prediction_df[features].copy()

        for col in categorical_cols:
            if col in X.columns:
                X[col] = X[col].astype(str)

        risk_probability = float(
            model.predict_proba(X)[0][1]
        )

        risk_cat = risk_category(
            risk_probability
        )
        updated_member = update_member_risk(
            new_member['Patient_ID'],
            risk_probability,
            risk_cat
        )

        logger.info(
            "Created member %s with risk probability %.6f (%s)",
            new_member['Patient_ID'],
            risk_probability,
            risk_cat
        )

        return jsonify({
            'success': True,
            'message': 'Member created successfully',
            'data': updated_member
        }), 201

    except ValueError as e:
        logger.warning(
            "Member creation validation error: %s",
            str(e)
        )

        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

    except Exception as e:
        logger.exception(
            "Failed to create member"
        )

        return jsonify({
            'success': False,
            'error': f'Failed to create member: {str(e)}'
        }), 500


@app.route('/api/members/<member_id>', methods=['GET'])
def api_get_member(member_id):
    try:
        member = get_member_by_id(member_id)

        if member is None:
            return jsonify({
                'success': False,
                'error': 'Member not found'
            }), 404

        return jsonify({
            'success': True,
            'data': member
        })

    except Exception as e:
        logger.exception(
            f"Failed to retrieve member {member_id}"
        )

        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/dataset-info', methods=['GET'])
def api_dataset_info():

    try:
        info = get_dataset_info()

        return jsonify({
            'success': True,
            'data': info
        })

    except Exception as e:
        logger.exception("Failed to retrieve dataset information")

        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/members/<member_id>/profile', methods=['GET'])
def api_get_member_profile(member_id):
    try:
        profile = build_member_profile(member_id)

        if profile is None:
            return jsonify({
                'success': False,
                'error': 'Member not found'
            }), 404

        return jsonify({
            'success': True,
            'data': profile
        })

    except Exception as e:
        logger.exception(
            f"Failed to build profile for {member_id}"
        )

        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/communities', methods=['GET'])
def api_get_communities():

    try:
        communities = get_all_communities()

        return jsonify({
            'success': True,
            'count': len(communities),
            'data': communities
        })

    except Exception as e:
        logger.exception("Failed to retrieve communities")

        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/communities/<state_name>', methods=['GET'])
def api_get_community(state_name):
    try:
        community = get_community_by_state(state_name)

        if community is None:
            return jsonify({
                'success': False,
                'error': 'Community not found'
            }), 404

        return jsonify({
            'success': True,
            'data': community
        })

    except Exception as e:
        logger.exception(
            f"Failed to retrieve community {state_name}"
        )

        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route(
    '/api/communities/<state_name>/statistics',
    methods=['GET']
)
def api_get_community_statistics(state_name):
    try:
        statistics = get_community_member_statistics(
            state_name
        )

        if statistics is None:
            return jsonify({
                'success': False,
                'error': 'Community not found'
            }), 404

        return jsonify({
            'success': True,
            'data': statistics
        })

    except Exception as e:
        logger.exception(
            f"Failed to calculate statistics for {state_name}"
        )

        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/map/communities', methods=['GET'])
def api_get_map_data():
    try:
        data = get_map_data()

        return jsonify({
            'success': True,
            'count': len(data),
            'data': data
        })

    except Exception as e:
        logger.exception("Failed to retrieve map data")

        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/analytics/dashboard', methods=['GET'])
def api_dashboard_analytics():

    try:
        summary = get_dashboard_summary()

        return jsonify({
            'success': True,
            'data': summary
        })

    except Exception as e:
        logger.exception(
            "Failed to generate dashboard analytics"
        )

        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/analytics/risk-distribution', methods=['GET'])
def api_risk_distribution():

    try:
        distribution = get_risk_distribution()

        return jsonify({
            'success': True,
            'data': distribution
        })

    except Exception as e:
        logger.exception(
            "Failed to generate risk distribution"
        )

        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/analytics/sdoh-factors', methods=['GET'])
def api_sdoh_factors():

    try:
        factors = get_sdoh_factor_analysis()

        return jsonify({
            'success': True,
            'data': factors
        })

    except Exception as e:
        logger.exception(
            "Failed to generate SDOH analysis"
        )

        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/analytics/risk-by-state', methods=['GET'])
def api_risk_by_state():

    try:
        data = get_risk_by_state()

        return jsonify({
            'success': True,
            'count': len(data),
            'data': data
        })

    except Exception as e:
        logger.exception(
            "Failed to generate state risk analysis"
        )

        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/analytics/demographics', methods=['GET'])
def api_demographics():

    try:
        data = get_demographic_summary()

        return jsonify({
            'success': True,
            'data': data
        })

    except Exception as e:
        logger.exception(
            "Failed to generate demographic analytics"
        )

        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
if __name__ == '__main__':
    if load_model():
        logger.info("Model loaded successfully.")
    else:
        logger.warning("Model not found. Server will start without the model.")

    app.run(
        host='127.0.0.1',
        port=5000,
        debug=True
    )