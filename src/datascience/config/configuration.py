
from src.datascience.constants import *
from src.datascience.utils.common import read_yaml, create_directories
from src.datascience.entity.config_entity import (
    DataIngestionConfig,
    DataValidationConfig,
    DataTransformationConfig
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