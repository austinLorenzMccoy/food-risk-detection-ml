# app.py
from fastapi import FastAPI, Request, Form, HTTPException, Depends
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.docs import get_swagger_ui_html
from pydantic import BaseModel
from typing import Dict, Any, Optional
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

app = FastAPI(title="Food Adulteration Detection API", 
              description="API for detecting food adulteration",
              version="1.0.0")

# Set up templates
templates = Jinja2Templates(directory="templates")

# Mount static files
try:
    app.mount("/static", StaticFiles(directory="static"), name="static")
    logger.info("Static files mounted successfully")
except Exception as e:
    logger.warning(f"Could not mount static files: {str(e)}")

# Define request models
class PredictionRequest(BaseModel):
    product_name: str
    brand: str
    category: str
    adulterant: str
    detection_date: Optional[str] = None
    detection_method: str
    severity: str
    action_taken: str
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "product_name": "Milk",
                "brand": "Example Brand",
                "category": "Dairy",
                "adulterant": "Melamine",
                "detection_method": "Chemical Test",
                "severity": "High",
                "action_taken": "Recall"
            }
        }
    }

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
            
            # For development purposes, create dummy artifacts if they don't exist
            if not all(p.exists() for p in [preprocessor_path, model_path, encoder_path]):
                logger.warning("Model artifacts not found. Creating dummy artifacts for development.")
                
                # Create directories if they don't exist
                (artifact_path / 'data_transformation').mkdir(parents=True, exist_ok=True)
                (artifact_path / 'model_trainer').mkdir(parents=True, exist_ok=True)
                
                # Create dummy preprocessor (a simple StandardScaler)
                from sklearn.preprocessing import StandardScaler, OneHotEncoder
                from sklearn.compose import ColumnTransformer
                from sklearn.pipeline import Pipeline
                
                # Create a simple preprocessor
                numeric_features = ['severity']
                categorical_features = ['product_name', 'brand', 'category', 'adulterant', 
                                      'detection_date', 'detection_method', 'action_taken']
                
                numeric_transformer = Pipeline(steps=[('scaler', StandardScaler())])
                categorical_transformer = Pipeline(steps=[('onehot', OneHotEncoder(handle_unknown='ignore'))])
                
                self.preprocessor = ColumnTransformer(
                    transformers=[
                        ('num', numeric_transformer, numeric_features),
                        ('cat', categorical_transformer, categorical_features)
                    ])
                
                # Create a dummy model (a simple RandomForestClassifier)
                from sklearn.ensemble import RandomForestClassifier
                self.model = RandomForestClassifier(n_estimators=10)
                
                # Create a dummy target encoder
                from sklearn.preprocessing import LabelEncoder
                self.target_encoder = LabelEncoder()
                self.target_encoder.classes_ = np.array(['Safe', 'Unsafe'])
                
                # Save the dummy artifacts for future use
                joblib.dump(self.preprocessor, preprocessor_path)
                joblib.dump(self.model, model_path)
                joblib.dump(self.target_encoder, encoder_path)
                
                logger.info("Created and saved dummy artifacts for development")
            else:
                # Load the real artifacts
                self.preprocessor = joblib.load(preprocessor_path)
                self.model = joblib.load(model_path)
                self.target_encoder = joblib.load(encoder_path)
            
            logger.debug(f"Preprocessor type: {type(self.preprocessor)}")
            logger.debug(f"Model type: {type(self.model)}")
            logger.info("Successfully loaded artifacts")
            
        except Exception as e:
            logger.error(f"Error loading artifacts: {str(e)}")
            logger.error(traceback.format_exc())
            logger.warning("Continuing with dummy model for demonstration purposes")
            
            # Create dummy objects for demonstration
            from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
            from sklearn.compose import ColumnTransformer
            from sklearn.pipeline import Pipeline
            from sklearn.ensemble import RandomForestClassifier
            
            self.preprocessor = ColumnTransformer(
                transformers=[
                    ('num', Pipeline(steps=[('scaler', StandardScaler())]), ['severity']),
                    ('cat', Pipeline(steps=[('onehot', OneHotEncoder(handle_unknown='ignore'))]), 
                     ['product_name', 'brand', 'category', 'adulterant', 'detection_date', 'detection_method', 'action_taken'])
                ])
            
            self.model = RandomForestClassifier(n_estimators=10)
            self.target_encoder = LabelEncoder()
            self.target_encoder.classes_ = np.array(['Safe', 'Unsafe'])

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

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/predict", response_class=JSONResponse)
async def predict_json(request: PredictionRequest):
    try:
        logger.info("Received prediction request via API")
        
        # Convert Pydantic model to dict
        data = request.dict()
        logger.debug(f"Received JSON data: {data}")

        # Add detection_date if not provided
        if not data.get('detection_date'):
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
        return response
        
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.post("/predict-form", response_class=HTMLResponse)
async def predict_form(request: Request):
    try:
        logger.info("Received prediction request via form")
        
        # Get form data
        form_data = await request.form()
        data = dict(form_data)
        logger.debug(f"Received form data: {data}")

        # Add detection_date if not provided
        if 'detection_date' not in data or not data['detection_date']:
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
            'timestamp': datetime.now().isoformat(),
            'request': request
        }
        
        logger.info("Successfully generated prediction")
        return templates.TemplateResponse("results.html", response)
        
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        logger.error(traceback.format_exc())
        
        return templates.TemplateResponse(
            "error.html", 
            {"request": request, "error": f"An error occurred: {str(e)}"}
        )

# Add OpenAPI documentation endpoints
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
    )

# Add health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8081, reload=True)