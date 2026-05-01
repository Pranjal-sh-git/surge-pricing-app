const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const buildUrl = (path) => `${API_BASE_URL.replace(/\/$/, '')}${path}`;

export async function predictSurge(payload) {
  const url = buildUrl('/api/predict-surge');
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('[API] predictSurge response', data);
    return data;
  } catch (error) {
    console.error('[API] predictSurge failed', error);
    return { status: 'error', message: error?.message || 'Network error' };
  }
}
