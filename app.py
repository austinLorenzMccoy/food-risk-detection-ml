# app.py
from flask import Flask, request, render_template, jsonify
import pandas as pd
from datetime import datetime
import joblib
from pathlib import Path
import numpy as np
from sklearn.exceptions import NotFittedError
import logging
import traceback

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

class ModelLoader:
    def __init__(self):
        self.preprocessor = None
        self.model = None
        self.target_encoder = None
        # Define feature names explicitly since we know our data structure
        self.feature_names = [
            'product_name', 'brand', 'category', 'adulterant',
            'detection_date', 'detection_method', 'severity', 'action_taken'
        ]
        self.load_artifacts()

    def load_artifacts(self):
        try:
            artifact_path = Path('artifacts')
            logger.info(f"Loading artifacts from {artifact_path}")
            
            preprocessor_path = artifact_path / 'data_transformation' / 'preprocessor.joblib'
            model_path = artifact_path / 'model_trainer' / 'model.joblib'
            encoder_path = artifact_path / 'data_transformation' / 'target_encoder.joblib'
            
            logger.debug(f"Checking paths exist: {preprocessor_path}, {model_path}, {encoder_path}")
            
            if not all(p.exists() for p in [preprocessor_path, model_path, encoder_path]):
                raise FileNotFoundError("One or more model artifacts not found")
            
            self.preprocessor = joblib.load(preprocessor_path)
            self.model = joblib.load(model_path)
            self.target_encoder = joblib.load(encoder_path)
            
            logger.debug(f"Preprocessor type: {type(self.preprocessor)}")
            logger.debug(f"Model type: {type(self.model)}")
            logger.info("Successfully loaded all artifacts")
            
        except Exception as e:
            logger.error(f"Error loading artifacts: {str(e)}")
            logger.error(traceback.format_exc())
            raise RuntimeError(f"Failed to load model artifacts: {str(e)}")

class PredictionPipeline:
    def __init__(self):
        self.model_loader = ModelLoader()
        
    def preprocess_data(self, df):
        """Preprocess input data"""
        try:
            logger.debug(f"Input DataFrame shape: {df.shape}")
            logger.debug(f"Input DataFrame columns: {df.columns.tolist()}")
            
            # Ensure all required columns are present
            for col in self.model_loader.feature_names:
                if col not in df.columns:
                    raise ValueError(f"Missing required column: {col}")
            
            # Reorder columns to match training data
            df = df[self.model_loader.feature_names]
            
            logger.debug(f"Data before preprocessing:\n{df.head()}")
            
            # Transform the data
            transformed_data = self.model_loader.preprocessor.transform(df)
            
            logger.debug(f"Transformed data shape: {transformed_data.shape}")
            return transformed_data
            
        except Exception as e:
            logger.error(f"Error in preprocessing: {str(e)}")
            logger.error(traceback.format_exc())
            raise

    def predict(self, transformed_data):
        try:
            logger.debug(f"Making prediction for data of shape: {transformed_data.shape}")
            
            prediction = self.model_loader.model.predict(transformed_data)
            prediction_proba = self.model_loader.model.predict_proba(transformed_data)
            
            logger.debug(f"Raw prediction: {prediction}")
            
            # Decode prediction
            predicted_class = self.model_loader.target_encoder.inverse_transform(prediction)[0]
            
            # Get probability scores
            class_probabilities = {
                self.model_loader.target_encoder.inverse_transform([i])[0]: float(prob)
                for i, prob in enumerate(prediction_proba[0])
            }
            
            logger.debug(f"Final prediction: {predicted_class}")
            logger.debug(f"Class probabilities: {class_probabilities}")
            
            return predicted_class, class_probabilities
            
        except Exception as e:
            logger.error(f"Error in prediction: {str(e)}")
            logger.error(traceback.format_exc())
            raise

# Initialize the pipeline
pipeline = PredictionPipeline()
logger.info("Successfully initialized PredictionPipeline")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        logger.info("Received prediction request")
        
        # Get data from request
        if request.is_json:
            data = request.get_json()
            logger.debug(f"Received JSON data: {data}")
        else:
            data = request.form.to_dict()
            logger.debug(f"Received form data: {data}")

        # Add detection_date if not provided
        if 'detection_date' not in data:
            data['detection_date'] = datetime.now().strftime('%Y-%m-%d')

        # Convert to DataFrame
        input_df = pd.DataFrame([data])
        logger.debug(f"Created DataFrame with columns: {input_df.columns.tolist()}")

        # Preprocess data
        transformed_data = pipeline.preprocess_data(input_df)
        
        # Make prediction
        predicted_class, class_probabilities = pipeline.predict(transformed_data)
        
        # Prepare response
        response = {
            'prediction': predicted_class,
            'confidence_scores': class_probabilities,
            'input_data': data,
            'timestamp': datetime.now().isoformat()
        }
        
        logger.info("Successfully generated prediction")
        
        if request.is_json:
            return jsonify(response)
        return render_template('results.html', **response)  # Changed from 'result.html' to 'results.html'
        
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        logger.error(traceback.format_exc())
        
        error_message = f"An error occurred: {str(e)}"
        if app.debug:
            error_message += f"\n\nDebug info:\n{traceback.format_exc()}"
        
        if request.is_json:
            return jsonify({'error': error_message}), 500
        return render_template('error.html', error=error_message), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8081, debug=True)