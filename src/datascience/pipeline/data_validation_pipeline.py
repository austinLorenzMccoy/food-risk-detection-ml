from src.datascience.config.configuration import ConfigurationManager
from src.datascience.components.data_validation import DataValidation
from src.datascience import logger


class DataValidationTrainingPipeline:
    def __init__(self):
        pass

    def initiate_data_validation(self):
            config = ConfigurationManager()
            data_validation_config = config.get_data_validation_config()
            data_validation = DataValidation(config=data_validation_config)
            data_validation.validate_all_columns()

if __name__ == "__main__":
    try:
        logger.info(f">>>>>> stage Data Validation started <<<<<<")
        obj = DataValidationTrainingPipeline()
        obj.initiate_data_validation()
        logger.info(f">>>>>> stage Data Validation completed <<<<<<\n\nx==========x")
    except Exception as e:
        logger.exception(e)
        raise e