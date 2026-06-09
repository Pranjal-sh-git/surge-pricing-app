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
  "cab_type_encoded": 0,   // 0=Ola, 1=Uber India (from training data)
  "name_encoded": 0        // ride tier encoding
}

Response:
{
  "predicted_surge": 1.25,
  "base_fare": 30.0,
  "rate_per_km": 12.0,
  "distance_km": 5,
  "estimated_fare": 156.25,       // (base_fare + distance_km * rate_per_km) * predicted_surge
  "surge_active": true,
  "status": "success"
}
"""

import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from predict import predict_surge
import traceback

logger = logging.getLogger(__name__)

app = Flask(__name__)
# Update the production URL before deploying
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "http://localhost:5174",
            "https://your-production-frontend-url.vercel.app"
        ]
    }
})

# ── Constants (matching frontend's existing pricing model) ─────
# Indian market rates (Auto ~₹8/km, Mini ~₹12/km, Sedan ~₹15/km)
TIER_BASE_FARES = {
    0: 15.0,   # Auto — low base fare
    1: 20.0,   # Mini
    2: 30.0,   # Sedan
    3: 30.0,   # Prime Sedan
    4: 50.0,   # Prime SUV
    5: 10.0,   # Bike — lowest base fare
}
TIER_RATES_PER_KM = {
    0: 8.0,    # Auto
    1: 10.0,   # Mini
    2: 13.0,   # Sedan
    3: 16.0,   # Prime Sedan
    4: 20.0,   # Prime SUV
    5: 6.0,    # Bike
}


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
      - cab_type        → cab_type_encoded (0=Ola, 1=Uber India)
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
        cab_type_encoded = int(data.get('cab_type_encoded', data.get('cab_type', 0)))
        name_encoded = int(data.get('name_encoded', data.get('ride_tier', 0)))

        # Get tier-specific rates
        tier_base = TIER_BASE_FARES.get(name_encoded, 30.0)
        tier_rate = TIER_RATES_PER_KM.get(name_encoded, 12.0)

        price = float(data.get('price', tier_base))

        # ── Demand intensity → adjust price signal ─────────────
        demand = data.get('demand')
        if demand is not None:
            demand = float(demand)
            price = price * (1 + (demand - 5) * 0.1)

        # ── Parse additional features ──────────────────────────
        weather_data = data.get('weather')
        simulateRain = data.get('simulateRain', data.get('simulate_rain', False))
        city_encoded = int(data.get('city_encoded', 2))  # default Bangalore
        is_bad_weather = 1 if (weather_data and weather_data.get('isBad')) or simulateRain else 0
        is_festival = int(data.get('is_festival', 0))

        # ── Build feature dict for model ───────────────────────
        model_input = {
            'distance_km': distance_km,
            'pickup_hour': pickup_hour,
            'pickup_day': pickup_day,
            'pickup_month': pickup_month,
            'price': price,
            'cab_type_encoded': cab_type_encoded,
            'name_encoded': name_encoded,
            'city_encoded': city_encoded,
            'is_bad_weather': is_bad_weather,
            'is_festival': is_festival,
        }

        # ── Debug: log model input ─────────────────────────────
        logger.debug("Model input: %s", model_input)

        # ── Run prediction ─────────────────────────────────────
        raw_prediction = predict_surge(model_input)
        predicted_surge = round(float(raw_prediction), 2)

        # Clamp surge to reasonable range [1.0, 5.0]
        predicted_surge = max(1.0, min(5.0, predicted_surge))

        # ── Calculate fare ─────────────────────────────────────
        estimated_fare = round((tier_base + distance_km * tier_rate) * predicted_surge, 2)

        response = {
            "status": "success",
            "predicted_surge": predicted_surge,
            "base_fare": tier_base,
            "rate_per_km": tier_rate,
            "distance_km": distance_km,
            "estimated_fare": estimated_fare,
            "surge_active": predicted_surge > 1.0,
        }

        # ── Debug: log response ────────────────────────────────
        logger.debug("Response: %s", response)

        return jsonify(response)

    except Exception as e:
        logger.error("Prediction failed: %s", traceback.format_exc())
        return jsonify({
            "status": "error",
            "message": f"Prediction failed: {str(e)}"
        }), 500


if __name__ == '__main__':
    logger.info("Ride Fare Prediction API starting on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
