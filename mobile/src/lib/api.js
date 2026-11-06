import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Alamat API, diisi dari .env
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
export const ASSET_URL = API_URL.replace(/\/api\/v1\/?$/, '');

const TOKEN_KEY = 'healthylife_token';

// Token disimpan terenkripsi di Keychain / Keystore
export const simpanToken = (token) => SecureStore.setItemAsync(TOKEN_KEY, token);
export const ambilToken = () => SecureStore.getItemAsync(TOKEN_KEY);
export const hapusToken = () => SecureStore.deleteItemAsync(TOKEN_KEY);

const api = axios.create({ baseURL: API_URL, timeout: 15000 });

// Sisipkan token di setiap request
api.interceptors.request.use(async (config) => {
  const token = await ambilToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const pesanError = (err) => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.code === 'ECONNABORTED' || !err?.response) return 'Tidak bisa terhubung ke server.';
  return 'Terjadi kesalahan, coba lagi.';
};

export default api;
