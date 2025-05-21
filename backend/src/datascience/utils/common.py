import os
import yaml
import json
import joblib
from pathlib import Path
from typing import Any
from ensure import ensure_annotations
from box import ConfigBox
from box.exceptions import BoxValueError
from src.datascience import logger


@ensure_annotations
def read_yaml(path_to_yaml: Path) -> ConfigBox:
    """Read a YAML file and return its content as a ConfigBox.

    Args:
        path_to_yaml (Path): Path to the YAML file.

    Raises:
        ValueError: If the YAML file is empty or invalid.

    Returns:
        ConfigBox: Content of the YAML file.
    """
    try:
        with open(path_to_yaml, "r") as yaml_file:
            content = yaml.safe_load(yaml_file)
            logger.info(f"YAML file loaded successfully from: {path_to_yaml}")
            return ConfigBox(content)
    except Exception as e:
        logger.error(f"Failed to read YAML file from: {path_to_yaml}. Error: {str(e)}")
        raise e


@ensure_annotations
def create_directories(path_to_directories: list, verbose: bool = True):
    """Create a list of directories if they don't already exist.

    Args:
        path_to_directories (list): List of paths to directories.
        verbose (bool, optional): Whether to log the directory creation. Defaults to True.
    """
    for path in path_to_directories:
        os.makedirs(path, exist_ok=True)
        if verbose:
            logger.info(f"Created directory at: {path}")


@ensure_annotations
def save_json(path: Path, data: dict):
    """Save data to a JSON file.

    Args:
        path (Path): Path to save the JSON file.
        data (dict): Data to save in the JSON file.
    """
    try:
        path.parent.mkdir(parents=True, exist_ok=True)  # Ensure the directory exists
        with open(path, "w") as f:
            json.dump(data, f, indent=4)
        logger.info(f"JSON file saved successfully at: {path}")
    except Exception as e:
        logger.error(f"Failed to save JSON file at: {path}. Error: {str(e)}")
        raise e


@ensure_annotations
def load_json(path: Path) -> ConfigBox:
    """Load data from a JSON file.

    Args:
        path (Path): Path to the JSON file.

    Returns:
        ConfigBox: Content of the JSON file.
    """
    try:
        with open(path, "r") as f:
            content = json.load(f)
        logger.info(f"JSON file loaded successfully from: {path}")
        return ConfigBox(content)
    except Exception as e:
        logger.error(f"Failed to load JSON file from: {path}. Error: {str(e)}")
        raise e


@ensure_annotations
def save_bin(path: Path, data: Any):
    """Save data to a binary file.

    Args:
        path (Path): Path to save the binary file.
        data (Any): Data to save in the binary file.
    """
    try:
        path.parent.mkdir(parents=True, exist_ok=True)  # Ensure the directory exists
        joblib.dump(data, path)
        logger.info(f"Binary file saved successfully at: {path}")
    except Exception as e:
        logger.error(f"Failed to save binary file at: {path}. Error: {str(e)}")
        raise e


@ensure_annotations
def load_bin(path: Path) -> Any:
    """Load data from a binary file.

    Args:
        path (Path): Path to the binary file.

    Returns:
        Any: Content of the binary file.
    """
    try:
        data = joblib.load(path)
        logger.info(f"Binary file loaded successfully from: {path}")
        return data
    except Exception as e:
        logger.error(f"Failed to load binary file from: {path}. Error: {str(e)}")
        raise e
