import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Attach the JWT (stored in localStorage) to every request.
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('sweety_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const errMsg = (e) =>
  e?.response?.data?.message || 'Something went wrong. Please try again.';

export const SLOTS = [
  { value: 'morning', label: 'Morning (fasting)', icon: '🌅' },
  { value: 'after_breakfast', label: 'After breakfast', icon: '🥣' },
  { value: 'after_lunch', label: 'After lunch', icon: '🍛' },
  { value: 'after_dinner', label: 'After dinner', icon: '🌙' },
];
export const slotLabel = (v) => SLOTS.find((s) => s.value === v)?.label || v;

// Target range guide (mg/dl). Must match server/src/utils/glucose.js.
export const LOW = 70;
export const HIGH = 180;
export const classify = (v) => (v < LOW ? 'low' : v > HIGH ? 'high' : 'in_range');
export const STATUS_TEXT = { low: 'Low', in_range: 'In range', high: 'High' };

// Dates are plain YYYY-MM-DD strings in IST, matching the server.
export const todayIST = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());

export const addDays = (iso, n) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

export const prettyDate = (iso, opts = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { ...opts, timeZone: 'UTC' });

export const greeting = () => {
  const h = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Asia/Kolkata' }).format(new Date()));
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

export default api;