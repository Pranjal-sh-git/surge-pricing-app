import { useState, useCallback } from 'react';
import { predictSurge } from '../services/api';

// Helper to calculate distance in km using Haversine formula
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10; // Round to 1 decimal place
};

export const useSurgeCalculation = (initialDemand = 5, initialSupply = 5, initialDistance = 10) => {
  const [demand, setDemand] = useState(initialDemand);
  const [supply, setSupply] = useState(initialSupply);
  const [distance, setDistance] = useState(initialDistance);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('Current Location');
  const [dropoffAddress, setDropoffAddress] = useState('Select destination...');

  const [surgeMultiplier, setSurgeMultiplier] = useState(1);
  const [totalFare, setTotalFare] = useState(0);
  const [baseFare, setBaseFare] = useState(50.0);
  const [ratePerKm, setRatePerKm] = useState(15.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [weather, setWeather] = useState(null); // { temp, condition, isBad }
  const [simulateRain, setSimulateRain] = useState(false);

  const fetchWeather = async (lat, lon) => {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      const data = await res.json();
      if (data.current_weather) {
        const code = data.current_weather.weathercode;
        // Weather codes: 51-67 (Rain), 71-77 (Snow), 80-82 (Showers), 95-99 (Storm)
        const isBad = (code >= 51 && code <= 67) || (code >= 71 && code <= 99);
        setWeather({
          temp: data.current_weather.temperature,
          condition: isBad ? 'Rainy/Stormy' : 'Clear/Cloudy',
          isBad
        });
      }
    } catch (e) {
      console.error('Weather fetch failed', e);
    }
  };

  const updateCoordinates = useCallback((type, coords, address) => {
    if (type === 'pickup') {
      setPickupCoords(coords);
      if (coords) fetchWeather(coords[0], coords[1]);
      if (address !== undefined) setPickupAddress(coords ? address : 'Select pickup on map...');
    } else {
      setDropoffCoords(coords);
      if (address !== undefined) setDropoffAddress(coords ? address : 'Select destination...');
    }

    // Only auto-calculate distance from straight-line as fallback
    // Real road distance comes from OSRM via onRouteData callback
    if (!coords) return; // null = reset, skip distance calc
    if (type === 'pickup' && dropoffCoords) {
      const d = calculateHaversineDistance(coords[0], coords[1], dropoffCoords[0], dropoffCoords[1]);
      if (d > 0) setDistance(d);
    } else if (type === 'dropoff' && pickupCoords) {
      const d = calculateHaversineDistance(pickupCoords[0], pickupCoords[1], coords[0], coords[1]);
      if (d > 0) setDistance(d);
    }
  }, [pickupCoords, dropoffCoords]);

  const fetchSurgeEstimate = async () => {
    setError('');

    if (distance <= 0) {
      setError('Please select two points on the map to calculate distance.');
      return false;
    }

    // Prepare final weather data for backend (Real or Simulated)
    const effectiveWeather = simulateRain 
      ? { temp: weather?.temp || 20, condition: 'Rainy (Simulated)', isBad: true }
      : weather;

    const requestBody = {
      distance_km: distance,
      demand,
      weather: effectiveWeather,
      price: baseFare,
      cab_type_encoded: 0,
      name_encoded: 0,
    };

    console.log('[API] predictSurge request body', requestBody);

    setLoading(true);
    try {
      const response = await predictSurge(requestBody);
      setLoading(false);

      if (response?.status !== 'success') {
        setError(response?.message || 'Unable to calculate surge price.');
        return false;
      }

      const mappedSurge = typeof response.predicted_surge === 'number'
        ? response.predicted_surge
        : Number(response.predicted_surge) || 1;

      const mappedBaseFare = typeof response.base_fare === 'number'
        ? response.base_fare
        : baseFare;

      const mappedRatePerKm = typeof response.rate_per_km === 'number'
        ? response.rate_per_km
        : ratePerKm;

      const mappedTotalFare = typeof response.estimated_fare === 'number'
        ? response.estimated_fare
        : Math.round(((mappedBaseFare + distance * mappedRatePerKm) * mappedSurge) * 100) / 100;

      setSurgeMultiplier(mappedSurge);
      setBaseFare(mappedBaseFare);
      setRatePerKm(mappedRatePerKm);
      setTotalFare(mappedTotalFare);
      return true;
    } catch (networkError) {
      setLoading(false);
      setError(networkError?.message || 'Unable to calculate surge price.');
      return false;
    }
  };

  return {
    demand, setDemand,
    supply, setSupply,
    distance, setDistance,
    pickupCoords, dropoffCoords,
    pickupAddress, dropoffAddress,
    updateCoordinates,
    surgeMultiplier,
    totalFare,
    baseFare,
    ratePerKm,
    loading,
    error,
    weather,
    simulateRain,
    setSimulateRain,
    fetchSurgeEstimate,
  };
};
