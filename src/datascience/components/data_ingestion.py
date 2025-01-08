import os
import logging
import urllib.request as request
import urllib.error
from os.path import getsize
import pandas as pd
from pathlib import Path
from typing import Tuple
from src.datascience.entity.config_entity import (DataIngestionConfig)

class DataIngestionError(Exception):
    """Custom exception for data ingestion errors"""
    pass

class DataIngestion:
    def __init__(self, config: DataIngestionConfig):
        self.config = config
        self._validate_config()

    def _validate_config(self):
        """Validate configuration parameters"""
        if not self.config.source_URL.startswith(('http://', 'https://')):
            raise DataIngestionError(f"Invalid URL format: {self.config.source_URL}")
        
        # Validate paths
        if not isinstance(self.config.local_data_file, (str, Path)):
            raise DataIngestionError("local_data_file must be a string or Path object")

        # Validate file extension
        if not str(self.config.local_data_file).endswith('.csv'):
            raise DataIngestionError("local_data_file must have .csv extension")

    def _validate_url(self) -> Tuple[bool, str]:
        """Validate if URL is accessible"""
        try:
            # Try to open the URL without downloading
            with request.urlopen(self.config.source_URL) as response:
                if response.code == 200:
                    return True, "URL is accessible"
        except urllib.error.HTTPError as e:
            return False, f"HTTP Error: {e.code} - {e.reason}"
        except urllib.error.URLError as e:
            return False, f"URL Error: {e.reason}"
        except Exception as e:
            return False, f"Error validating URL: {str(e)}"
        return False, "Unknown error occurred while validating URL"

    def download_file(self):
        """Download CSV file from source URL with error handling"""
        if os.path.exists(self.config.local_data_file):
            file_size = getsize(self.config.local_data_file)
            logging.info(f"File already exists of size: {file_size} bytes")
            return

        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(self.config.local_data_file), exist_ok=True)

        # Validate URL before attempting download
        is_valid, message = self._validate_url()
        if not is_valid:
            raise DataIngestionError(f"URL validation failed: {message}")

        try:
            filename, headers = request.urlretrieve(
                url=self.config.source_URL,
                filename=self.config.local_data_file
            )
            logging.info(f"File downloaded successfully to {filename}")
            logging.debug(f"Download headers: {headers}")
            
            # Validate that the downloaded file is a valid CSV
            self._validate_csv_file(filename)
            
            return filename
        except Exception as e:
            raise DataIngestionError(f"Error downloading file: {str(e)}")

    def _validate_csv_file(self, file_path):
        """Validate that the file is a proper CSV file"""
        try:
            # Try to read the first few rows to validate CSV format
            df = pd.read_csv(file_path, nrows=5)
            logging.info(f"CSV file validated successfully. Shape: {df.shape}")
        except Exception as e:
            raise DataIngestionError(f"Invalid CSV file: {str(e)}")

    def get_data_frame(self):
        """Read the CSV file and return as pandas DataFrame"""
        if not os.path.exists(self.config.local_data_file):
            raise DataIngestionError("CSV file not found. Please download the file first.")
        
        try:
            df = pd.read_csv(self.config.local_data_file)
            logging.info(f"Data loaded successfully. Shape: {df.shape}")
            return df
        except Exception as e:
            raise DataIngestionError(f"Error reading CSV file: {str(e)}")

    def run(self):
        """Run the complete data ingestion process"""
        try:
            logging.info("Starting data ingestion process...")
            self.download_file()
            df = self.get_data_frame()
            logging.info("Data ingestion completed successfully")
            return df
        except Exception as e:
            logging.error(f"Data ingestion failed: {str(e)}")
            raise