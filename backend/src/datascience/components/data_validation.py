import os
from src.datascience import logger
import pandas as pd
from src.datascience.utils.common import create_directories, read_yaml
from src.datascience.entity.config_entity import DataValidationConfig

class DataValidation:
    def __init__(self, config: DataValidationConfig):
        self.config = config
        self.validation_status = False
        
        # Ensure the validation directory exists
        create_directories([self.config.root_dir])

    def validate_all_columns(self) -> bool:
        """
        Validates that all required columns exist in the dataset
        Returns: bool indicating if validation passed
        """
        try:
            data = pd.read_csv(self.config.data_path)
            schema_cols = list(self.config.all_schema.keys())
            data_cols = list(data.columns)

            # Check if all required columns exist
            missing_cols = [col for col in schema_cols if col not in data_cols]
            
            if missing_cols:
                self.validation_status = False
                with open(self.config.STATUS_FILE, 'w') as f:
                    f.write(f"Validation status: {self.validation_status}\nMissing columns: {', '.join(missing_cols)}")
                return self.validation_status

            self.validation_status = True
            with open(self.config.STATUS_FILE, 'w') as f:
                f.write(f"Validation status: {self.validation_status}\nAll required columns present")
            return self.validation_status

        except Exception as e:
            logger.error(f"Error in validate_all_columns: {str(e)}")
            raise e

    def validate_schema(self, data: pd.DataFrame) -> bool:
        """
        Validates the data types of all columns against the schema
        Args:
            data: DataFrame to validate
        Returns: bool indicating if validation passed
        """
        try:
            self.validation_status = True
            validation_errors = []
            
            # Validate column data types
            for column, expected_type in self.config.all_schema.items():
                if expected_type == "int":
                    valid = pd.api.types.is_integer_dtype(data[column])
                elif expected_type == "str":
                    valid = pd.api.types.is_string_dtype(data[column])
                else:
                    valid = False
                    validation_errors.append(f"Unsupported type {expected_type} for column {column}")
                
                if not valid:
                    self.validation_status = False
                    validation_errors.append(f"Invalid datatype for {column}: expected {expected_type}")
            
            # Write validation results
            with open(self.config.STATUS_FILE, 'a') as f:
                f.write("\n=== Schema Validation Results ===\n")
                if validation_errors:
                    f.write("\n".join(validation_errors))
                f.write(f"\nSchema validation status: {self.validation_status}")
            
            return self.validation_status

        except Exception as e:
            logger.error(f"Error in validate_schema: {str(e)}")
            raise e
