import pytest
import pandas as pd
import numpy as np
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

# Mock the ModelLoader and PredictionPipeline classes before importing
patch('app.Path.exists', return_value=True).start()
patch('app.joblib.load', return_value=MagicMock()).start()

# Now import the classes
from app import ModelLoader, PredictionPipeline, app

@pytest.fixture
def sample_data():
    """Create sample data for testing"""
    return pd.DataFrame({
        'product_name': ['Test Product'],
        'brand': ['Test Brand'],
        'category': ['Test Category'],
        'adulterant': ['Test Adulterant'],
        'detection_date': ['2023-01-01'],
        'detection_method': ['Test Method'],
        'severity': ['High'],
        'action_taken': ['Test Action']
    })

@pytest.mark.unit
def test_model_loader_init():
    """Test ModelLoader initialization with mocked artifacts"""
    with patch('app.joblib.load') as mock_load:
        mock_load.return_value = MagicMock()
        with patch('app.Path.exists') as mock_exists:
            mock_exists.return_value = True
            loader = ModelLoader()
            assert loader.preprocessor is not None
            assert loader.model is not None
            assert loader.target_encoder is not None

@pytest.mark.unit
def test_preprocess_data(sample_data):
    """Test data preprocessing with mocked preprocessor"""
    with patch.object(ModelLoader, 'load_artifacts'):
        pipeline = PredictionPipeline()
        pipeline.model_loader.preprocessor = MagicMock()
        pipeline.model_loader.preprocessor.transform.return_value = np.array([[1, 2, 3, 4]])
        
        result = pipeline.preprocess_data(sample_data)
        
        assert result is not None
        assert isinstance(result, np.ndarray)
        pipeline.model_loader.preprocessor.transform.assert_called_once()

@pytest.mark.unit
def test_predict():
    """Test prediction with mocked model"""
    with patch.object(ModelLoader, 'load_artifacts'):
        pipeline = PredictionPipeline()
        
        # Mock the model and encoder
        pipeline.model_loader.model = MagicMock()
        pipeline.model_loader.model.predict.return_value = np.array([0])
        pipeline.model_loader.model.predict_proba.return_value = np.array([[0.8, 0.2]])
        
        pipeline.model_loader.target_encoder = MagicMock()
        pipeline.model_loader.target_encoder.inverse_transform.side_effect = lambda x: ['Safe' if x[0] == 0 else 'Unsafe']
        
        # Test with dummy transformed data
        transformed_data = np.array([[1, 2, 3, 4]])
        predicted_class, class_probabilities = pipeline.predict(transformed_data)
        
        assert predicted_class == 'Safe'
        assert isinstance(class_probabilities, dict)
        assert len(class_probabilities) > 0

@pytest.fixture
def client():
    """Create a test client for FastAPI app"""
    # Apply patches for testing
    with patch.object(ModelLoader, 'load_artifacts'):
        with patch.object(PredictionPipeline, 'preprocess_data', return_value=np.array([[1, 2, 3, 4]])):
            with patch.object(PredictionPipeline, 'predict', return_value=('Safe', {'Safe': 0.8, 'Unsafe': 0.2})):
                client = TestClient(app)
                return client

@pytest.mark.unit
def test_predict_endpoint(client):
    """Test the /predict endpoint"""
    # Test data
    test_data = {
        "product_name": "Test Product",
        "brand": "Test Brand",
        "category": "Test Category",
        "adulterant": "Test Adulterant",
        "detection_method": "Test Method",
        "severity": "High",
        "action_taken": "Test Action"
    }
    
    # Make request to the endpoint
    response = client.post("/predict", json=test_data)
    
    # Check response
    assert response.status_code == 200
    data = response.json()
    assert data["prediction"] == "Safe"
    assert "confidence_scores" in data
    assert "input_data" in data
    assert "timestamp" in data

@pytest.mark.unit
def test_health_endpoint(client):
    """Test the /health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data
