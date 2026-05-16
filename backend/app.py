"""
Flask API server for Ride Fare Prediction + Surge Estimation.

Endpoints:
  POST /api/predict-surge   → Returns predicted surge multiplier & fare breakdown
  GET  /api/health          → Health check

Request body for /api/predict-surge:
{
  "distance_km": 5,
  "pickup_hour": 18,       // 0-23
  "pickup_day": 4,         // 0=Mon, 6=Sun
  "pickup_month": 11,      // 1-12
  "price": 10,             // base price estimate
  "cab_type_encoded": 0,   // 0=Lyft, 1=Uber (from training data)
  "name_encoded": 0        // ride tier encoding
}

Response:
{
  "predicted_surge": 1.25,
  "base_fare": 50.0,
  "rate_per_km": 15.0,
  "distance_km": 5,
  "estimated_fare": 156.25,       // (base_fare + distance_km * rate_per_km) * predicted_surge
  "surge_active": true,
  "status": "success"
}
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from predict import predict_surge
import traceback

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from the frontend

# ── Constants (matching frontend's existing pricing model) ─────
BASE_FARE = 50.0
RATE_PER_KM = 15.0


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "service": "ride-fare-prediction"})


@app.route('/api/predict-surge', methods=['POST'])
def predict_surge_endpoint():
    """
    Predict surge multiplier using the trained XGBoost model.
    
    Maps frontend inputs to model features:
      - distance_km     → distance_km
      - pickup_hour     → pickup_hour (auto-detected from current time if missing)
      - pickup_day      → pickup_day  (auto-detected from current time if missing)
      - pickup_month    → pickup_month (auto-detected from current time if missing)
      - price           → price (base price estimate, defaults to BASE_FARE)
      - cab_type        → cab_type_encoded (0=Lyft, 1=Uber)
      - ride_tier       → name_encoded (0-5 mapping of ride tiers)
    """
    try:
        data = request.get_json(force=True)

        if not data:
            return jsonify({"status": "error", "message": "Request body is required"}), 400

        # ── Extract & validate distance (required) ─────────────
        distance_km = data.get('distance_km')
        if distance_km is None:
            return jsonify({"status": "error", "message": "distance_km is required"}), 400

        distance_km = float(distance_km)
        if distance_km <= 0:
            return jsonify({"status": "error", "message": "distance_km must be positive"}), 400

        # ── Auto-detect time fields if not provided ────────────
        from datetime import datetime
        now = datetime.now()

        pickup_hour = int(data.get('pickup_hour', now.hour))
        pickup_day = int(data.get('pickup_day', now.weekday()))
        pickup_month = int(data.get('pickup_month', now.month))

        # ── Optional fields with defaults ──────────────────────
        price = float(data.get('price', BASE_FARE))
        cab_type_encoded = int(data.get('cab_type_encoded', data.get('cab_type', 0)))
        name_encoded = int(data.get('name_encoded', data.get('ride_tier', 0)))

        # ── Demand intensity → adjust price signal ─────────────
        demand = data.get('demand')
        if demand is not None:
            demand = float(demand)
            price = price * (1 + (demand - 5) * 0.1)

        # ── Weather impact → adjust price signal ───────────────
        # Simulate surge impact of rain/snow if not already in model columns
        weather_data = data.get('weather')
        if weather_data and weather_data.get('isBad'):
            # Bad weather increases price signal (and thus predicted surge) by ~20%
            price = price * 1.2

        # ── Build feature dict for model ───────────────────────
        model_input = {
            'distance_km': distance_km,
            'pickup_hour': pickup_hour,
            'pickup_day': pickup_day,
            'pickup_month': pickup_month,
            'price': price,
            'cab_type_encoded': cab_type_encoded,
            'name_encoded': name_encoded,
        }

        # ── Debug: log model input ─────────────────────────────
        print(f"[DEBUG] Model input: {model_input}")

        # ── Run prediction ─────────────────────────────────────
        raw_prediction = predict_surge(model_input)
        predicted_surge = round(float(raw_prediction), 2)

        # Clamp surge to reasonable range [1.0, 5.0]
        predicted_surge = max(1.0, min(5.0, predicted_surge))

        # ── Calculate fare ─────────────────────────────────────
        estimated_fare = round((BASE_FARE + distance_km * RATE_PER_KM) * predicted_surge, 2)

        response = {
            "status": "success",
            "predicted_surge": predicted_surge,
            "base_fare": BASE_FARE,
            "rate_per_km": RATE_PER_KM,
            "distance_km": distance_km,
            "estimated_fare": estimated_fare,
            "surge_active": predicted_surge > 1.0,
        }

        # ── Debug: log response ────────────────────────────────
        print(f"[DEBUG] Response: {response}")

        return jsonify(response)

    except Exception as e:
        print(f"[ERROR] Prediction failed: {traceback.format_exc()}")
        return jsonify({
            "status": "error",
            "message": f"Prediction failed: {str(e)}"
        }), 500


if __name__ == '__main__':
    print("==> Ride Fare Prediction API starting on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
