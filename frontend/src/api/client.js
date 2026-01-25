import axios from 'axios';

// Prefer env variable; fallback to local backend
const baseURL = import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default client;
