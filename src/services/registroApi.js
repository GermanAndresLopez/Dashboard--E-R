import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const agregarRegistro = async (registro) => {
  const response = await axios.post(`${API_URL}/agregar`, registro);
  return response.data;
};

export const cargarCSV = async (formData) => {
  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
