from dataclasses import dataclass   # dataclasses module is used to create data classes
from pathlib import Path

@dataclass
class DataIngestionConfig:
    root_dir: Path
    source_URL: str
    local_data_file: Path

@dataclass
class DataValidationConfig:
    root_dir: Path
    STATUS_FILE: Path
    all_schema: dict
    data_path: Path  # Added data_path to config