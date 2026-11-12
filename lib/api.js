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
  { value: 'morning', label: 'Morning (fasting)' },
  { value: 'after_breakfast', label: 'After breakfast' },
  { value: 'after_lunch', label: 'After lunch' },
  { value: 'after_dinner', label: 'After dinner' },
];
export const slotLabel = (v) => SLOTS.find((s) => s.value === v)?.label || v;

// Today's date (YYYY-MM-DD) in IST, matching the server.
export const todayIST = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());

export const prettyDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
  });

export default api;
