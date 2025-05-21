import os
import mlflow
from mlflow.tracking import MlflowClient

# Set MLflow tracking URI and credentials
# For security, use environment variables or a config file for credentials
# You can set these environment variables before running the script:
# export MLFLOW_TRACKING_URI="https://dagshub.com/austinLorenzMccoy/CompleteDSproject.mlflow"
# export MLFLOW_TRACKING_USERNAME="your-username"
# export MLFLOW_TRACKING_PASSWORD="your-password"

# Use environment variables if set, otherwise use defaults
tracking_uri = os.environ.get(
    "MLFLOW_TRACKING_URI", 
    "https://dagshub.com/austinLorenzMccoy/CompleteDSproject.mlflow"
)
os.environ["MLFLOW_TRACKING_URI"] = tracking_uri

# Note: For production, NEVER hardcode credentials in your script
# The following is only for development/demo purposes
if "MLFLOW_TRACKING_USERNAME" not in os.environ:
    print("Warning: MLFLOW_TRACKING_USERNAME not set in environment variables")
    os.environ["MLFLOW_TRACKING_USERNAME"] = "your-username"  # Replace with your username

if "MLFLOW_TRACKING_PASSWORD" not in os.environ:
    print("Warning: MLFLOW_TRACKING_PASSWORD not set in environment variables")
    os.environ["MLFLOW_TRACKING_PASSWORD"] = "your-password"  # Replace with your password

# Create MLflow client
client = MlflowClient()

# List all experiments
print("=== Available Experiments ===")
experiments = client.search_experiments()
for experiment in experiments:
    print(f"Experiment ID: {experiment.experiment_id}, Name: {experiment.name}")
    
    # Get runs for this experiment
    runs = client.search_runs(experiment_ids=[experiment.experiment_id])
    print(f"  Total runs: {len(runs)}")
    
    # Print details of each run
    for run in runs:
        print(f"  Run ID: {run.info.run_id}")
        print(f"    Status: {run.info.status}")
        print(f"    Start time: {run.info.start_time}")
        print(f"    End time: {run.info.end_time}")
        
        # Print metrics
        print("    Metrics:")
        for key, value in run.data.metrics.items():
            print(f"      {key}: {value}")
            
        # Print parameters
        print("    Parameters:")
        for key, value in run.data.params.items():
            print(f"      {key}: {value}")
        
        print("    ----")
    print("\n")
