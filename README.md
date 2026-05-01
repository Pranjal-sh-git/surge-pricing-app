# Surge Pricing Web Application ⚡🚗

A modern, full-stack surge pricing prediction system. This project features a 3D Cyberpunk-inspired React frontend that communicates with a Python Flask machine-learning backend to dynamically estimate ride fares and surge multipliers based on real-time factors like distance and demand.

## Project Structure
- **Backend:** Python Flask API serving an XGBoost surge pricing prediction model.
- **Frontend:** React + Vite web application with interactive 3D elements and dynamic UI.

---

## 🛠️ Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (v18+ recommended)
- **Python** (v3.8+ recommended)

---

## 🚀 How to Run the Project

You need to run both the backend API and the frontend application simultaneously in separate terminal windows.

### 1. Start the Backend API

Open your terminal and navigate to the backend directory:

```bash
cd RideFarePredictionMAIN/RideFarePredictionMAIN/RideFarePrediction
```

Install the required Python dependencies:
*(It is recommended to use a virtual environment)*

```bash
pip install -r requirements.txt
```

Run the Flask application:

```bash
python app.py
```

*The backend server will start on `http://localhost:5000`.*

### 2. Start the Frontend Application

Open a **new** terminal window and navigate to the frontend directory:

```bash
cd surge-pricing-frontend
```

Install the required Node.js dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

*The frontend application will start on `http://localhost:5173`. Open this URL in your browser to view the application.*

---

## 💡 Features
- **Real-time Price Estimation:** Adjust the distance and demand sliders to see the estimated fare update instantly.
- **Dynamic Surge Indicator:** The UI provides real-time feedback on current surge levels (Standard, Moderate, or High).
- **Interactive 3D Elements:** Engaging premium UI built with React Three Fiber and Framer Motion.
