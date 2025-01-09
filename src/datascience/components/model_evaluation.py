from sklearn.metrics import precision_score, accuracy_score,recall_score, f1_score
import pandas as pd
import mlflow
from pathlib import Path
import numpy as np
import joblib
from urllib.parse import urlparse
import mlflow.sklearn  # Instead of mlflow.keras
from src.datascience.utils.common import create_directories, read_yaml, save_json
from src.datascience.entity.config_entity import ModelEvaluationConfig
import os

os.environ["MLFLOW_TRACKING_URI"]="https://dagshub.com/austinLorenzMccoy/CompleteDSproject.mlflow"
os.environ["MLFLOW_TRACKING_USERNAME"]="austinLorenzMccoy"
os.environ["MLFLOW_TRACKING_PASSWORD"]="1d06b3f1dc94bb2bb3ed0960c7d406847b9d362d"

class ModelEvaluation:
    def __init__(self, config: ModelEvaluationConfig):
        self.config = config

    def eval_metrics(self, actual, pred):
        accuracy = accuracy_score(actual, pred)
        precision = precision_score(actual, pred, average='weighted')
        recall = recall_score(actual, pred, average='weighted')
        f1 = f1_score(actual, pred, average='weighted')
        return accuracy, precision, recall, f1

    def log_into_mlflow(self):
        test_data = pd.read_csv(self.config.test_data_path)
        model = joblib.load(self.config.model_path)

        test_x = test_data.drop(['target'], axis=1)
        test_y = test_data['target']

        mlflow.set_registry_uri(self.config.mlflow_uri)  # Changed from mlflow_tracking_uri
       
        tracking_url_type_store = urlparse(mlflow.get_tracking_uri()).scheme

        with mlflow.start_run():
            predicted_qualities = model.predict(test_x)

            (accuracy, precision, recall, f1) = self.eval_metrics(test_y, predicted_qualities)

            scores = {"accuracy": accuracy, "precision": precision, "recall": recall, "f1": f1}

            # Save metrics locally
            save_json(path=Path(self.config.metric_file_name), data=scores)

            # Log parameters and metrics to MLflow
            mlflow.log_params(self.config.all_params)
            mlflow.log_metric("accuracy", accuracy)
            mlflow.log_metric("precision", precision)
            mlflow.log_metric("recall", recall)
            mlflow.log_metric("f1", f1)

            # Log model to MLflow
            if tracking_url_type_store != "file":
                mlflow.sklearn.log_model(model, "model", registered_model_name="SklearnModel")
            else:
                mlflow.sklearn.log_model(model, "model")
