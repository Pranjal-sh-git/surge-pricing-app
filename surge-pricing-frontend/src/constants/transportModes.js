import { Car, Train, Plane } from 'lucide-react';

// ── Transport mode config ─────────────────────────────────────────
export const MODES = {
  cab: {
    id: 'cab',
    label: 'Cab',
    icon: Car,
    color: '#1DB954',
    bg: 'rgba(29,185,84,0.08)',
    border: 'rgba(29,185,84,0.2)',
    tagline: 'Door-to-door comfort',
  },
  train: {
    id: 'train',
    label: 'Train',
    icon: Train,
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.2)',
    tagline: 'Reliable & economical',
  },
  flight: {
    id: 'flight',
    label: 'Flight',
    icon: Plane,
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)',
    tagline: 'Fastest, premium',
  },
};
