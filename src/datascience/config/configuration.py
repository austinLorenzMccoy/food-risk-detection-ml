from src.datascience.constants import *
from src.datascience.utils.common import read_yaml, create_directories
from dataclasses import dataclass
from pathlib import Path

from src.datascience.entity.config_entity import (DataIngestionConfig,DataValidationConfig)

@dataclass
class DataIngestionConfig:
    root_dir: Path
    source_URL: str
    local_data_file: Path

class ConfigurationManager:
    def __init__(self, 
                 config_filepath=CONFIG_FILE_PATH,
                 params_filepath=PARAMS_FILE_PATH,
                 schema_filepath=SCHEMA_FILE_PATH):
        
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
        """
        Creates and returns the data validation configuration
        """
        if "COLUMNS" not in self.schema:
            raise KeyError("The schema file does not contain a 'COLUMNS' key.")
        
        data_validation_config = DataValidationConfig(
            root_dir=Path(self.config.data_validation.root_dir),
            STATUS_FILE=Path(self.config.data_validation.STATUS_FILE),
            all_schema=self.schema.COLUMNS,
            data_path=Path(self.config.data_ingestion.local_data_file)  # Add data path from config
        )
        return data_validation_config