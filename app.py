# app.py
from flask import Flask, request, render_template, jsonify
from src.datascience.pipeline.prediction_pipeline import PredictionPipeline
import pandas as pd
from datetime import datetime
import joblib
from pathlib import Path
import os

app = Flask(__name__)

# Load the preprocessor and target encoder
preprocessor = joblib.load(Path('artifacts/data_transformation/preprocessor.joblib'))
target_encoder = joblib.load(Path('artifacts/data_transformation/target_encoder.joblib'))

class PredictionRequest:
    def __init__(self, form_data):
        self.product_name = form_data.get('product_name')
        self.brand = form_data.get('brand')
        self.category = form_data.get('category')
        self.adulterant = form_data.get('adulterant')
        self.detection_date = form_data.get('detection_date', datetime.now().strftime('%Y-%m-%d'))
        self.detection_method = form_data.get('detection_method')
        self.severity = form_data.get('severity')
        self.action_taken = form_data.get('action_taken')

    def to_dataframe(self):
        return pd.DataFrame([{
            'product_name': self.product_name,
            'brand': self.brand,
            'category': self.category,
            'adulterant': self.adulterant,
            'detection_date': self.detection_date,
            'detection_method': self.detection_method,
            'severity': self.severity,
            'action_taken': self.action_taken
        }])

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if request.is_json:
            data = request.get_json()
            prediction_request = PredictionRequest(data)
        else:
            prediction_request = PredictionRequest(request.form)

        # Convert request to DataFrame
        input_df = prediction_request.to_dataframe()
        
        # Transform the input data using the preprocessor
        transformed_data = preprocessor.transform(input_df)
        
        # Make prediction
        pipeline = PredictionPipeline()
        prediction = pipeline.predict(transformed_data)
        prediction_proba = pipeline.predict_proba(transformed_data)
        
        # Decode the prediction back to original class label
        predicted_class = target_encoder.inverse_transform(prediction)[0]
        
        # Get probability scores for each class
        class_probabilities = {
            target_encoder.inverse_transform([i])[0]: float(prob)
            for i, prob in enumerate(prediction_proba[0])
        }
        
        response = {
            'prediction': predicted_class,
            'confidence_scores': class_probabilities,
            'input_data': input_df.to_dict(orient='records')[0],
            'timestamp': datetime.now().isoformat()
        }
        
        if request.is_json:
            return jsonify(response)
        return render_template('result.html', **response)
        
    except Exception as e:
        error_response = {'error': str(e)}
        if request.is_json:
            return jsonify(error_response), 400
        return render_template('error.html', error=str(e)), 400

@app.route('/api/metadata')
def get_metadata():
    """Endpoint to get form metadata like available options for dropdowns"""
    try:
        # You would typically load this from a database or configuration
        metadata = {
            'categories': ['Dairy', 'Meat', 'Spices', 'Beverages', 'Oils'],
            'detection_methods': ['Chemical Analysis', 'Spectroscopy', 'Chromatography', 'Visual Inspection'],
            'severity_levels': ['Low', 'Medium', 'High', 'Critical'],
            'actions': ['Product Recall', 'Warning Issued', 'Further Testing', 'No Action Required']
        }
        return jsonify(metadata)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8082, debug=True)




# Product Name: Fresh Valley Milk
# Brand: Fresh Valley Dairy
# Category: Dairy
# Adulterant: Melamine
# Detection Date: 2025-01-09 (today)
# Detection Method: Spectroscopy
# Severity: High
# Action Taken: Product Recall

