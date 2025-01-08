from src.datascience.config.configuration import ConfigurationManager
from src.datascience.components.data_transformation import DataTransformation
from src.datascience import logger

class DataTransformationTrainingPipeline:
    def __init__(self):
        pass

    def initiate_data_transformation(self):
        try:
            config = ConfigurationManager()
            data_transformation_config = config.get_data_transformation_config()
            data_transformation = DataTransformation(config=data_transformation_config)
            data_transformation.transform_data()
        except Exception as e:
            logger.error(f"Error in data transformation pipeline: {str(e)}")
            raise e
        
if __name__ == "__main__":
    try:
        logger.info(f">>>>>> stage Data Transformation started <<<<<<")
        obj = DataTransformationTrainingPipeline()
        obj.initiate_data_transformation()
        logger.info(f">>>>>> stage Data Transformation completed <<<<<<\n\nx==========x")
    except Exception as e:
        logger.exception(e)
        raise e
