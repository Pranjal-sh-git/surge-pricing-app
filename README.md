# SurgeIQ — AI-Powered Surge Pricing Engine

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black) ![Flask](https://img.shields.io/badge/Flask-3.x-000000?style=flat-square&logo=flask&logoColor=white) ![XGBoost](https://img.shields.io/badge/XGBoost-v2.x-13B7F0?style=flat-square) ![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=flat-square&logo=python&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

Real-time surge multiplier prediction for Indian ride-sharing, powered by XGBoost trained on 50,000 synthetic Indian ride profiles.

![SurgeIQ Demo](./docs/demo.gif)

---

## Features

- **ML Surge Prediction** — XGBoost model achieving **84.84% R² accuracy** on Indian ride contexts.
- **Indian Context** — Simulates standard operators (Ola, Uber India) and ride categories (Auto, Mini, Sedan, Prime Sedan, Prime SUV, Bike).
- **Multi-Modal Comparison** — Offers dynamic fare comparison across Cab, Rail, and Air modes for long/medium distance routes.
- **Live Weather Integration** — Integrates Open-Meteo weather API with a simulated monsoon toggle to adjust real-time surge parameters.
- **Surge Heatmap** — Displays real-time high-intensity surge zones around the pickup location using a custom `leaflet.heat` overlay.
- **Model Insights Dashboard** — Interactive stats board displaying accuracy metrics, feature importances, hourly rush peaks, and monthly surge trends.
- **Festival & Monsoon Aware** — Model trained to evaluate specific surge hikes during Diwali, Holi, New Year, and monsoon seasons.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS v4, Framer Motion |
| **3D / Map** | Three.js, React Three Fiber, Leaflet, `leaflet.heat` |
| **Backend** | Python, Flask, Flask-CORS |
| **ML Model** | XGBoost, scikit-learn, pandas, numpy |
| **APIs** | Open-Meteo (weather), OSRM (routing), Nominatim (geocoding) |

---

## Model Performance

| Metric | Value |
|--------|-------|
| **R² Score** | `0.8484` (84.84% accuracy) |
| **RMSE** | `0.2061` |
| **MAE** | `0.1321` |
| **Training Data** | 50,000 synthetic Indian ride records |
| **Top Feature** | Festival Day (`53.67%` relative importance) |

---

## How to Run

### Prerequisites
- Python 3.8+
- Node.js 18+

### 1. Backend API
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Launch the development Flask server:
   ```bash
   python app.py
   ```
   *The server starts on `http://localhost:5000`.*

### 2. Frontend Web App
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Set up local environments:
   ```bash
   cp .env.example .env.local
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application starts at `http://localhost:5173/`.*

---

## Project Structure

```
.
├── backend/                  # Flask REST API & Machine Learning logic
│   ├── notebooks/            # Jupyter notebooks for data gen & model training
│   │   ├── indian_rides.csv  # Synthetic dataset of 50,000 rides
│   │   ├── model.pkl         # Serialized XGBoost regression model
│   │   └── feature_importance.png
│   ├── tests/                # Flask API test cases
│   ├── app.py                # Server entry point, CORS configuration, routing
│   ├── predict.py            # Model loader & inference wrapper
│   └── requirements.txt      # Backend dependencies
│
└── frontend/                 # React SPA application (Vite-based)
    ├── public/               # Static public assets
    ├── src/                  # React source directory
    │   ├── components/       # Custom React components (Map, Dashboard, UI)
    │   ├── contexts/         # Theme and state contexts
    │   ├── hooks/            # Custom React hooks (surge math estimation)
    │   ├── services/         # API client configurations
    │   ├── App.jsx           # Root layout & route container
    │   └── index.css         # Main stylesheets & theme variables
    ├── package.json          # Node dependencies & build scripts
    └── vite.config.js        # Vite bundler configurations
```

---

## Data & Model

Real-world ride-sharing datasets from Ola/Uber are proprietary and heavily restricted. To construct a viable surge prediction system, a synthetic dataset of 50,000 records was compiled to encode typical Indian ride-sharing rules: peak hour congestion, monsoon season modifiers, heavy holiday surges (Diwali, Holi, New Year's), and city baselines. Training models on realistic synthetic data that replicates ground-truth distribution parameters is a standard, industry-accepted approach for developing production machine learning prototypes.

---

## License

This project is licensed under the [MIT License](LICENSE).
