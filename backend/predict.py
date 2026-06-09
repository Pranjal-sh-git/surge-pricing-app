import pickle
import pandas as pd
import os

_model = None

def _get_model():
    global _model
    if _model is None:
        _dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(_dir, "notebooks", "model.pkl")
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at expected path: {model_path}")
        with open(model_path, "rb") as f:
            _model = pickle.load(f)
    return _model

# SAME features as training
feature_cols = [
    'distance_km',
    'pickup_hour',
    'pickup_day',
    'pickup_month',
    'price',
    'cab_type_encoded',
    'name_encoded',
    'city_encoded',
    'is_bad_weather',
    'is_festival'
]

def predict_surge(data):
    df = pd.DataFrame([data])
    df = df[feature_cols]
    model = _get_model()
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
        "name_encoded": 0,
        "city_encoded": 2,
        "is_bad_weather": 0,
        "is_festival": 0
    }

    result = predict_surge(sample)
    print("Predicted Surge:", result)