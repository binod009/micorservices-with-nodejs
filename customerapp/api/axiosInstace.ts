import axios, { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'https://localhost:3007', // Replace with your API base URL
    timeout: 10000, // Request timeout in milliseconds
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    config => {
        // Do something before request is sent
        // For example, you can add an authorization token here
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    response => {
        // Do something with response data
        return response;
    },
    error => {
        // Do something with response error
        return Promise.reject(error);
    }
);

export default axiosInstance;