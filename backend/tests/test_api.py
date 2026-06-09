import pytest

def test_health(client):
    """GET /api/health returns 200 and status 'ok'"""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'ok'

def test_predict_missing_distance(client):
    """POST /api/predict-surge with empty body returns 400"""
    response = client.post('/api/predict-surge', json={})
    assert response.status_code == 400
    data = response.get_json()
    assert data['status'] == 'error'
    assert 'message' in data

def test_predict_negative_distance(client):
    """POST with distance_km: -5 returns 400"""
    response = client.post('/api/predict-surge', json={'distance_km': -5})
    assert response.status_code == 400
    data = response.get_json()
    assert data['status'] == 'error'
    assert 'distance_km must be positive' in data['message']

def test_predict_surge_clamped(client):
    """POST with distance_km: 100, demand: 10, price: 500 returns predicted_surge between 1.0 and 5.0"""
    payload = {
        'distance_km': 100.0,
        'demand': 10,
        'price': 500.0,
        'cab_type_encoded': 0,
        'name_encoded': 0
    }
    response = client.post('/api/predict-surge', json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'success'
    predicted_surge = data['predicted_surge']
    assert 1.0 <= predicted_surge <= 5.0

def test_bad_weather_increases_fare(client):
    """POST with isBad: true should return predicted_surge >= same request with isBad: false"""
    payload_good_weather = {
        'distance_km': 10.0,
        'demand': 5,
        'price': 50.0,
        'cab_type_encoded': 0,
        'name_encoded': 0,
        'weather': {'isBad': False, 'temp': 20.0, 'condition': 'Clear'}
    }
    payload_bad_weather = {
        'distance_km': 10.0,
        'demand': 5,
        'price': 50.0,
        'cab_type_encoded': 0,
        'name_encoded': 0,
        'weather': {'isBad': True, 'temp': 15.0, 'condition': 'Rainy'}
    }
    
    res_good = client.post('/api/predict-surge', json=payload_good_weather)
    res_bad = client.post('/api/predict-surge', json=payload_bad_weather)
    
    assert res_good.status_code == 200
    assert res_bad.status_code == 200
    
    data_good = res_good.get_json()
    data_bad = res_bad.get_json()
    
    assert data_good['status'] == 'success'
    assert data_bad['status'] == 'success'
    
    assert data_bad['predicted_surge'] >= data_good['predicted_surge']
