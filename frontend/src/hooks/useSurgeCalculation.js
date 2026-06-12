import { useState, useCallback, useRef } from 'react';
import { predictSurge } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// Helper to calculate distance in km using Haversine formula
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10;
};

export const useSurgeCalculation = (initialDemand = 5, initialSupply = 5, initialDistance = 10) => {
  let addRideToHistory = null;
  try {
    const auth = useAuth();
    addRideToHistory = auth.addRideToHistory;
  } catch (e) {
    // Suppress context error in test environment
  }

  const requestIdRef = useRef(0);
  const [demand, setDemand] = useState(initialDemand);
  const [supply, setSupply] = useState(initialSupply);
  const [distance, setDistance] = useState(initialDistance);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('Current Location');
  const [dropoffAddress, setDropoffAddress] = useState('Select destination...');

  const [surgeMultiplier, setSurgeMultiplier] = useState(1);
  const [totalFare, setTotalFare] = useState(0);
  const [baseFare, setBaseFare] = useState(30.0);
  const [ratePerKm, setRatePerKm] = useState(12.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [weather, setWeather] = useState(null);
  const [simulateRain, setSimulateRain] = useState(false);
  const [cabType, setCabType] = useState(0);
  const [rideTier, setRideTier] = useState(0);

  // ── Multi-modal state ──────────────────────────────────────────
  const [activeMode, setActiveMode] = useState('cab');
  const [trainFare, setTrainFare] = useState(0);
  const [trainEta, setTrainEta] = useState(0);
  const [trainSurge, setTrainSurge] = useState(1.0);
  const [flightFare, setFlightFare] = useState(0);
  const [flightEta, setFlightEta] = useState(0);
  const [flightSurge, setFlightSurge] = useState(1.0);

  const fetchWeather = useCallback(async (lat, lon) => {
    const controller = new AbortController();
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
        { signal: controller.signal }
      );
      const data = await res.json();
      if (data.current_weather) {
        const code = data.current_weather.weathercode;
        const isBad = (code >= 51 && code <= 67) || (code >= 71 && code <= 99);
        setWeather({
          temp: data.current_weather.temperature,
          condition: isBad ? 'Rainy/Stormy' : 'Clear/Cloudy',
          isBad,
        });
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error('Weather fetch failed', e);
      }
    }
    return () => {
      controller.abort();
    };
  }, []);

  // ── Train fare calculator ──────────────────────────────────────
  const calculateTrainFare = (distKm, demandLevel) => {
    if (!distKm || distKm <= 0) return { fare: 0, eta: 0, surge: 1.0 };
    const rate = distKm > 500 ? 16 : distKm > 200 ? 12 : 8;
    const base = Math.max(50, distKm * rate);
    const hour = new Date().getHours();
    const isPeak = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 21);
    const surge = isPeak ? 1.15 : 1.0;
    const fare = Math.round(base * surge);
    const avgSpeedKmh = distKm > 500 ? 100 : 80;
    const eta = Math.round((distKm / avgSpeedKmh) * 60);
    return { fare, eta, surge };
  };

  // ── Flight fare calculator ─────────────────────────────────────
  const calculateFlightFare = (distKm, demandLevel) => {
    if (!distKm || distKm <= 0) return { fare: 0, eta: 0, surge: 1.0 };
    if (distKm < 200) return { fare: 0, eta: 0, surge: 1.0 };
    const baseTicket = 3500;
    const distCharge = Math.max(0, (distKm - 200) * 4);
    const rawFare = baseTicket + distCharge;
    const fuelSurcharge = distKm < 500 ? 1.20 : distKm < 1000 ? 1.10 : 1.05;
    const demandSurge =
      demandLevel >= 8 ? 1.35
      : demandLevel >= 6 ? 1.20
      : demandLevel >= 4 ? 1.10
      : 1.0;
    const totalSurge = Math.round(fuelSurcharge * demandSurge * 100) / 100;
    const fare = Math.round(rawFare * totalSurge);
    const eta = Math.round((distKm / 700) * 60 + 90);
    return { fare, eta, surge: totalSurge };
  };

  const updateCoordinates = useCallback(
    (type, coords, address) => {
      if (type === 'pickup') {
        setPickupCoords(coords);
        if (coords) fetchWeather(coords[0], coords[1]);
        if (address !== undefined)
          setPickupAddress(coords ? address : 'Select pickup on map...');
      } else {
        setDropoffCoords(coords);
        if (address !== undefined)
          setDropoffAddress(coords ? address : 'Select destination...');
      }

      if (!coords) return;
      if (type === 'pickup' && dropoffCoords) {
        const d = calculateHaversineDistance(
          coords[0], coords[1], dropoffCoords[0], dropoffCoords[1]
        );
        if (d > 0) setDistance(d);
      } else if (type === 'dropoff' && pickupCoords) {
        const d = calculateHaversineDistance(
          pickupCoords[0], pickupCoords[1], coords[0], coords[1]
        );
        if (d > 0) setDistance(d);
      }
    },
    [pickupCoords, dropoffCoords, fetchWeather]
  );

  const fetchSurgeEstimate = async () => {
    setError('');

    if (distance <= 0) {
      setError('Please select two points on the map to calculate distance.');
      return false;
    }

    if (isNaN(distance) || !isFinite(distance)) {
      setError('Could not calculate route distance. Please reselect your pickup and destination.');
      return false;
    }

    const effectiveWeather = simulateRain
      ? { temp: weather?.temp ?? 20, condition: 'Rainy (Simulated)', isBad: true }
      : (weather ?? { temp: 20, condition: 'Unknown', isBad: false });

    const requestBody = {
      distance_km: distance,
      demand,
      weather: effectiveWeather,
      price: baseFare,
      cab_type_encoded: cabType,
      name_encoded: rideTier,
    };

    console.log('[API] predictSurge request body', requestBody);

    const currentId = ++requestIdRef.current;
    setLoading(true);
    try {
      const response = await predictSurge(requestBody);
      if (currentId !== requestIdRef.current) return false;
      setLoading(false);

      if (response?.status !== 'success') {
        setError(response?.message || 'Unable to calculate surge price.');
        return false;
      }

      const mappedSurge =
        typeof response.predicted_surge === 'number'
          ? response.predicted_surge
          : Number(response.predicted_surge) || 1;

      const mappedBaseFare =
        typeof response.base_fare === 'number' ? response.base_fare : baseFare;

      const mappedRatePerKm =
        typeof response.rate_per_km === 'number' ? response.rate_per_km : ratePerKm;

      const mappedTotalFare =
        typeof response.estimated_fare === 'number'
          ? response.estimated_fare
          : Math.round(
              ((mappedBaseFare + distance * mappedRatePerKm) * mappedSurge) * 100
            ) / 100;

      setSurgeMultiplier(mappedSurge);
      setBaseFare(mappedBaseFare);
      setRatePerKm(mappedRatePerKm);
      setTotalFare(mappedTotalFare);

      // Save to history if logged in
      if (addRideToHistory) {
        addRideToHistory({
          distance_km: distance,
          cabType,
          rideTier,
          surgeMultiplier: mappedSurge,
          totalFare: mappedTotalFare,
          pickupAddress,
          dropoffAddress
        });
      }

      // ── Recalculate alternate modes ────────────────────────
      const { fare: tf, eta: te, surge: ts } = calculateTrainFare(distance, demand);
      setTrainFare(tf);
      setTrainEta(te);
      setTrainSurge(ts);

      const { fare: ff, eta: fe, surge: fs } = calculateFlightFare(distance, demand);
      setFlightFare(ff);
      setFlightEta(fe);
      setFlightSurge(fs);

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
    surgeMultiplier, totalFare, baseFare, ratePerKm,
    loading, error,
    weather, simulateRain, setSimulateRain,
    fetchSurgeEstimate,
    cabType, setCabType,
    rideTier, setRideTier,
    // Multi-modal
    activeMode, setActiveMode,
    trainFare, trainEta, trainSurge,
    flightFare, flightEta, flightSurge,
    calculateTrainFare, calculateFlightFare,
  };
};
