import axios from 'axios';

// Alamat API
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// Alamat file gambar
export const ASSET_URL = API_URL.replace(/\/api\/v1\/?$/, '');

export const TOKEN_KEY = 'healthylife_token';

const client = axios.create({ baseURL: API_URL });

// Token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Message error
export const pesanError = (err) =>
  err?.response?.data?.message || 'Terjadi kesalahan, coba lagi.';

export default client;
