import pickle
import pandas as pd
import os

# Load trained model — path relative to this script
_dir = os.path.dirname(os.path.abspath(__file__))
model = pickle.load(open(os.path.join(_dir, "notebooks", "model.pkl"), "rb"))

# SAME features as training
feature_cols = [
    'distance_km',
    'pickup_hour',
    'pickup_day',
    'pickup_month',
    'price',
    'cab_type_encoded',
    'name_encoded'
]

def predict_surge(data):
    df = pd.DataFrame([data])
    df = df[feature_cols]
    prediction = model.predict(df)[0]
    return prediction


# Example test (optional-Example)
if __name__ == "__main__":
    sample = {
        "distance_km": 5,
        "pickup_hour": 18,
        "pickup_day": 4,
        "pickup_month": 11,
        "price": 10,
        "cab_type_encoded": 0,
        "name_encoded": 0
    }

    result = predict_surge(sample)
    print("Predicted Surge:", result)