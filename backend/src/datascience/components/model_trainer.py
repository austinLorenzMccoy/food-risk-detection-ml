import os
from src.datascience import logger
from pathlib import Path
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from src.datascience.utils.common import create_directories, read_yaml, save_json
from src.datascience.entity.config_entity import ModelTrainerConfig
import joblib

class ModelTrainer:
    def __init__(self, config: ModelTrainerConfig):
        self.config = config

    def train(self):
        try:
            # Load transformed data
            logger.info("Loading transformed data")
            data = pd.read_csv(self.config.train_data_path)

            # Split features and target
            X = data.drop(columns=[self.config.target_column], axis=1)
            y = data[self.config.target_column]

            # Split data into training and validation sets
            X_train, X_val, y_train, y_val = train_test_split(
                X, y,
                test_size=self.config.train_test_ratio,
                random_state=self.config.random_state
            )

            logger.info("Training Random Forest model")
            rf_classifier = RandomForestClassifier(
                **self.config.model_params,
                random_state=self.config.random_state
            )

            rf_classifier.fit(X_train, y_train)

            # Make predictions on validation set
            logger.info("Making predictions on validation set")
            y_pred = rf_classifier.predict(X_val)

            # Calculate metrics
            accuracy = accuracy_score(y_val, y_pred)
            classification_rep = classification_report(y_val, y_pred, output_dict=True)
            conf_matrix = confusion_matrix(y_val, y_pred)

            # Save metrics
            metrics = {
                "accuracy": float(accuracy),  # Convert numpy float to Python float
                "classification_report": classification_rep,
                "confusion_matrix": conf_matrix.tolist()
            }

            # Save feature importances
            feature_importance = pd.DataFrame({
                'feature': X.columns,
                'importance': rf_classifier.feature_importances_
            }).sort_values('importance', ascending=False)

            metrics['feature_importance'] = feature_importance.to_dict('records')

            # Create directory if it doesn't exist
            os.makedirs(self.config.root_dir, exist_ok=True)

            # Save model and metrics
            metrics_path = Path(self.config.root_dir) / "metrics.json"
            save_json(metrics_path, metrics)
            
            joblib.dump(rf_classifier, self.config.model_path)

            logger.info(f"Model training completed. Accuracy: {accuracy:.4f}")
            
            return metrics

        except Exception as e:
            logger.error(f"Error in model training: {str(e)}")
            raise e

