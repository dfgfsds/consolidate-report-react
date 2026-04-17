import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'https://consolidate-report-api.ftdigitalsolutions.org',
});

// Interceptor for errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;
