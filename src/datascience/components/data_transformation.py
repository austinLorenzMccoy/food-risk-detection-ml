import os
from dataclasses import dataclass
from pathlib import Path
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib

from src.datascience import logger
from src.datascience.utils.common import create_directories, read_yaml
from src.datascience.entity.config_entity import DataTransformationConfig

class DataTransformation:
    def __init__(self, config: DataTransformationConfig):
        self.config = config
        self.label_encoders = {}
        self.target_encoder = LabelEncoder()
        
    def get_data_transformer(self):
        """
        Creates the data transformation pipeline
        """
        try:
            # Categorical columns (excluding target and ID)
            categorical_columns = [
                'product_name', 'brand', 'category', 'adulterant',
                'detection_method', 'severity', 'action_taken'
            ]
            
            # Date column
            date_column = ['detection_date']
            
            # Create preprocessing steps for categorical and date features
            categorical_transformer = Pipeline(steps=[
                ('label_encoder', self.CustomLabelEncoder())
            ])
            
            date_transformer = Pipeline(steps=[
                ('date_converter', self.DateFeatureExtractor())
            ])
            
            # Combine all transformers
            preprocessor = ColumnTransformer(
                transformers=[
                    ('cat', categorical_transformer, categorical_columns),
                    ('date', date_transformer, date_column)
                ],
                remainder='passthrough'
            )
            
            return preprocessor
            
        except Exception as e:
            logger.error(f"Error in creating data transformer: {str(e)}")
            raise e
    
    class CustomLabelEncoder:
        """Custom transformer for label encoding with handling for unknown values"""
        def __init__(self):
            self.encoders = {}
            
        def fit(self, X, y=None):
            X = pd.DataFrame(X)
            for column in X.columns:
                self.encoders[column] = LabelEncoder()
                self.encoders[column].fit(X[column])
            return self
            
        def transform(self, X):
            X = pd.DataFrame(X)
            X_encoded = X.copy()
            for column in X.columns:
                encoder = self.encoders[column]
                X_encoded[column] = X[column].map(
                    lambda x: -1 if x not in encoder.classes_ else encoder.transform([x])[0]
                )
            return X_encoded
            
    class DateFeatureExtractor:
        """Custom transformer for extracting features from dates"""
        def fit(self, X, y=None):
            return self
            
        def transform(self, X):
            X = pd.DataFrame(X)
            date_df = pd.to_datetime(X.iloc[:, 0])
            return pd.DataFrame({
                'year': date_df.dt.year,
                'month': date_df.dt.month,
                'day': date_df.dt.day
            })
    
    def transform_data(self):
        """
        Transforms the data using the preprocessing pipeline
        """
        try:
            # Read the data
            df = pd.read_csv(self.config.data_path)
            
            # Separate features and target
            X = df.drop(columns=[self.config.target_column, 'adulteration_id'])
            y = df[self.config.target_column]
            
            # Create and fit the preprocessor
            preprocessor = self.get_data_transformer()
            X_transformed = preprocessor.fit_transform(X)
            
            # Transform target variable
            y_transformed = self.target_encoder.fit_transform(y)
            
            # Create feature names
            feature_names = (
                [f"{col}_{i}" for col, n_cols in zip(['product_name', 'brand', 'category', 'adulterant',
                                                     'detection_method', 'severity', 'action_taken'], 
                                                    [1]*7) for i in range(n_cols)] +
                ['year', 'month', 'day']
            )
            
            # Convert to DataFrame
            transformed_df = pd.DataFrame(
                X_transformed,
                columns=feature_names
            )
            transformed_df['target'] = y_transformed
            
            # Save the preprocessor and transformed data
            create_directories([self.config.root_dir])
            joblib.dump(preprocessor, self.config.preprocessor_path)
            transformed_df.to_csv(self.config.transformed_data_path, index=False)
            
            # Save target encoder
            joblib.dump(self.target_encoder, 
                       Path(self.config.root_dir) / "target_encoder.joblib")
            
            return transformed_df
            
        except Exception as e:
            logger.error(f"Error in transforming data: {str(e)}")
            raise e