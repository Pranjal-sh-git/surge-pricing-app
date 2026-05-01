import { useState } from 'react';
import { predictSurge } from '../services/api';

export const useSurgeCalculation = (initialDemand = 5, initialSupply = 5, initialDistance = 10) => {
  const [demand, setDemand] = useState(initialDemand);
  const [supply, setSupply] = useState(initialSupply);
  const [distance, setDistance] = useState(initialDistance);
  const [surgeMultiplier, setSurgeMultiplier] = useState(1);
  const [totalFare, setTotalFare] = useState(0);
  const [baseFare, setBaseFare] = useState(50.0);
  const [ratePerKm, setRatePerKm] = useState(15.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSurgeEstimate = async () => {
    setError('');

    if (distance <= 0) {
      setError('Distance must be greater than zero.');
      return false;
    }

    const requestBody = {
      distance_km: distance,
      demand,
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

      console.log('[API] Mapped response', {
        surgeMultiplier: mappedSurge,
        totalFare: mappedTotalFare,
        baseFare: mappedBaseFare,
        ratePerKm: mappedRatePerKm,
      });

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
    surgeMultiplier,
    totalFare,
    baseFare,
    ratePerKm,
    loading,
    error,
    fetchSurgeEstimate,
  };
};
