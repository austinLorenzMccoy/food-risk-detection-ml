from dataclasses import dataclass
from pathlib import Path
from typing import Optional, Dict, List, Any

@dataclass(frozen=True)
class DataIngestionConfig:
    root_dir: Path
    source_URL: str
    local_data_file: Path

@dataclass(frozen=True)
class DataValidationConfig:
    root_dir: Path
    STATUS_FILE: Path
    all_schema: dict
    data_path: Path

@dataclass(frozen=True)
class DataTransformationConfig:
    root_dir: Path
    data_path: Path
    preprocessor_path: Path
    transformed_data_path: Path
    target_column: str
    target_encoder_path: Path
    feature_names_path: Path
    categorical_columns: list[str]
    numerical_columns: list[str]
    date_columns: list[str]
    id_columns: list[str]
    
    @property
    def feature_columns(self) -> list[str]:
        """Returns all feature columns excluding id and target columns"""
        return (
            self.categorical_columns + 
            self.numerical_columns + 
            self.date_columns
        )
@dataclass(frozen=True)
class ModelTrainerConfig:
    root_dir: Path
    train_data_path: Path
    model_path: Path  # Move this above default arguments
    metric_file_name: Path
    target_column: str
    feature_columns: List[str]
    model_params: Dict[str, Any]  # Model-specific parameters
    test_data_path: Optional[Path] = None  # Optional if not splitting explicitly
    train_test_ratio: float = 0.2  # Default value for train-test split ratio
    random_state: int = 42  # Default random seed for reproducibility
