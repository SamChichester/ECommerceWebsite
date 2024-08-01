import axios from 'axios';

// Create an Axios instance for the main requests
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create an Axios instance for refreshing tokens
const refreshInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

let refresh = false;

// Request interceptor to add the Authorization header to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      const deviceId = document.cookie.split('; ').find(row => row.startsWith('device_id='));
      if (deviceId) {
        config.headers['Device-ID'] = deviceId.split('=')[1];
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !refresh) {
      refresh = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        console.log('Attempting to refresh token with:', refreshToken); 
        const response = await refreshInstance.post('/api/token/refresh/', { refresh: refreshToken });

        if (response.status === 200) {
          const newAccessToken = response.data.access;
          localStorage.setItem('access_token', newAccessToken);

          // Update the Authorization header for the original request
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          // Retry the original request with the new access token
          refresh = false;
          console.log('Token refreshed successfully');
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Handle token refresh failure (e.g., log out the user, redirect to login page)
        console.error('Refresh token error:', refreshError);
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    refresh = false;
    return Promise.reject(error);
  }
);

export default axiosInstance;
