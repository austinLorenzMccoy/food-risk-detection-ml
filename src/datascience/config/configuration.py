
from src.datascience.constants import *
from src.datascience.utils.common import read_yaml, create_directories
from src.datascience.entity.config_entity import (
    DataIngestionConfig,
    DataValidationConfig,
    DataTransformationConfig,
    ModelTrainerConfig,
    ModelEvaluationConfig
)
from pathlib import Path
from dataclasses import dataclass

@dataclass
class DataIngestionConfig:
    root_dir: Path
    source_URL: str
    local_data_file: Path


class ConfigurationManager:
    def __init__(
        self,
        config_filepath=CONFIG_FILE_PATH,
        params_filepath=PARAMS_FILE_PATH,
        schema_filepath=SCHEMA_FILE_PATH
    ):
        self.config = read_yaml(config_filepath)
        self.params = read_yaml(params_filepath)
        self.schema = read_yaml(schema_filepath)

        create_directories([self.config.artifacts_root])

    def get_data_ingestion_config(self) -> DataIngestionConfig:
        config = self.config.data_ingestion
        
        create_directories([config.root_dir])

        data_ingestion_config = DataIngestionConfig(
            root_dir=config.root_dir,
            source_URL=config.source_URL,
            local_data_file=config.local_data_file
        )

        return data_ingestion_config
    
    def get_data_validation_config(self) -> DataValidationConfig:
        config = self.config.data_validation
        schema = self.schema.COLUMNS

        create_directories([config.root_dir])

        data_validation_config = DataValidationConfig(
            root_dir=config.root_dir,
            STATUS_FILE=config.STATUS_FILE,
            all_schema=schema,
            data_path=self.config.data_ingestion.local_data_file
        )

        return data_validation_config
    
    def get_data_transformation_config(self) -> DataTransformationConfig:
        config = self.config.data_transformation
        
        create_directories([config.root_dir])

        data_transformation_config = DataTransformationConfig(
            root_dir=Path(config.root_dir),
            data_path=Path(self.config.data_ingestion.local_data_file),
            preprocessor_path=Path(config.root_dir) / "preprocessor.joblib",
            transformed_data_path=Path(config.root_dir) / "transformed_data.csv",
            target_column=self.schema.TARGET_COLUMN.name,
            target_encoder_path=Path(config.root_dir) / "target_encoder.joblib",
            feature_names_path=Path(config.root_dir) / "feature_names.json",
            categorical_columns=[
                'product_name', 'brand', 'category', 'adulterant',
                'detection_method', 'severity', 'action_taken'
            ],
            numerical_columns=['adulteration_id'],
            date_columns=['detection_date'],
            id_columns=['adulteration_id']
        )

        return data_transformation_config
    

    def get_model_trainer_config(self) -> ModelTrainerConfig:
        config = self.config.model_trainer
        model_params = {
            "n_estimators": config.model_params.n_estimators,
            "max_depth": config.model_params.max_depth,
            "min_samples_split": config.model_params.min_samples_split,
            "min_samples_leaf": config.model_params.min_samples_leaf
        }

        create_directories([config.root_dir])

        model_trainer_config = ModelTrainerConfig(
            root_dir=Path(config.root_dir),
            train_data_path=Path(self.config.data_transformation.transformed_data_path),
            model_path=Path(config.root_dir) / "model.joblib",
            target_column=config.target_column,
            train_test_ratio=config.train_test_ratio,
            random_state=config.random_state,
            model_params=model_params,
            metric_file_name=config.metric_file_name,  # Add this line
            feature_columns=self.schema.COLUMNS  # Add this line
        )

        return model_trainer_config

    def get_model_evaluation_config(self) -> ModelEvaluationConfig:
            config = self.config.model_evaluation
            model_params = self.params.KerasModel  
            target_column = 'target'  

            create_directories([config.root_dir])

            model_evaluation_config = ModelEvaluationConfig(
                root_dir=Path(config.root_dir),
                test_data_path=Path(self.config.data_transformation.transformed_data_path),
                model_path=Path(config.model_path),
                metric_file_name=Path(config.metric_file_name),
                all_params=model_params,
                target_column=target_column,
                mlflow_uri="https://dagshub.com/austinLorenzMccoy/CompleteDSproject.mlflow"  
            )
            return model_evaluation_config

