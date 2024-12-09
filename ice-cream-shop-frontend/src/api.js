import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',  // Backend API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Login API call
export const login = (credentials) => API.post('/login', credentials);
