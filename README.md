# End-to-End Workflow for Predicting Health Risk in Product Adulteration Using Machine Learning

## Project Overview
This repository implements an end-to-end data science project named **DataScience**. The project encompasses all stages of a data science workflow, including data ingestion, data transformation, model training, and pipeline orchestration. It also features utility scripts, configurations, and well-structured logging and exception handling.

## Project Structure
The project directory is organized as follows:

```
.
├── .github/workflows/.gitkeep
├── src/
│   ├── datascience/
│   │   ├── __init__.py
│   │   ├── components/
│   │   │   ├── __init__.py
│   │   │   ├── data_ingestion.py
│   │   │   ├── data_validation.py
|   |   |   ├── data_transformation.py
│   │   │   └── model_trainer.py
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   └── common.py
│   │   ├── exception.py
│   │   ├── config/
│   │   │   ├── __init__.py
│   │   │   └── configuration.py
│   │   ├── logger.py
│   │   ├── pipeline/
│   │   │   ├── __init__.py
│   │   │   ├── data_ingestion_pipeline.py
│   │   │   ├── data_validation_pipeline.py
│   │   │   ├── prediction_pipeline.py
│   │   │   └── training_pipeline.py
│   │   ├── entity/
│   │   │   ├── __init__.py
│   │   │   └── config_entity.py
│   │   └── constants/
│   │       └── __init__.py
├── config/
│   └── config.yaml
├── params.yaml
├── schema.yaml
├── main.py
├── setup.py
├── Dockerfile
├── research/
│   └── research.ipynb
└── templates/
    └── index.html
```

## Key Features and Modules

### 1. Components
- **Data Ingestion** (`data_ingestion.py`): Manages data collection and storage.
- **Data Transformation** (`data_transformation.py`): Converts raw data into a format suitable for analysis and modeling.
- **Model Trainer** (`model_trainer.py`): Handles the training of machine learning models.

### 2. Pipeline
- **Training Pipeline** (`training_pipeline.py`): Orchestrates the training process end-to-end.
- **Prediction Pipeline** (`prediction_pipeline.py`): Handles prediction tasks on new data.

### 3. Utilities
- **Common Utilities** (`common.py`): Includes helper functions used throughout the project.

### 4. Configuration
- **Config Module** (`configuration.py`): Loads and parses configuration settings from `config.yaml`.
- **Params** (`params.yaml`): Stores hyperparameters for model training.
- **Schema** (`schema.yaml`): Defines the data structure and constraints.

### 5. Logging and Exception Handling
- **Logger** (`logger.py`): Centralized logging for debugging and monitoring.
- **Custom Exceptions** (`exception.py`): Handles errors in a standardized manner.

### 6. Entity and Constants
- **Entity** (`config_entity.py`): Defines structured configurations such as data paths, model settings, and more to ensure clean and maintainable code.
- **Constants** (`constants/__init__.py`): Stores immutable values like file paths and default parameters, reducing hardcoding and simplifying updates.

### 7. Docker Support
- **Dockerfile**: Ensures a consistent runtime environment for deployment.

### 8. Research and Development
- **Research Notebook** (`research.ipynb`): Used for exploratory data analysis and prototyping.

### 9. Web Interface
- **HTML Template** (`index.html`): Provides a simple user interface for interacting with the project.

## How to Run the Project

### Prerequisites
- Python 3.8 or later
- Docker (optional for containerization)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/austinLorenzMccoy/CompleteDSproject.git
   cd CompleteDSproject
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up the project:
   ```bash
   python setup.py install
   ```

### Running the Project
1. To execute the training pipeline:
   ```bash
   python src/datascience/pipeline/training_pipeline.py
   ```

2. To run the prediction pipeline:
   ```bash
   python src/datascience/pipeline/prediction_pipeline.py
   ```

### Using Docker
1. Build the Docker image:
   ```bash
   docker build -t datascience-project .
   ```

2. Run the Docker container:
   ```bash
   docker run -it datascience-project
   ```

## Contribution
We welcome contributions! Feel free to fork this repository, make improvements, and submit a pull request.

## License
This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.

## Contact
For inquiries or feedback, please contact:
- **Name**: Chibueze Augustine Chidera
- **Email**: chibuezeaugustine23@gmail.com
- **GitHub**: [austinLorenzMccoy](https://github.com/austinLorenzMccoy)

