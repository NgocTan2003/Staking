import axios from 'axios';
 
const BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});


axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.setItem("requireWalletReconnect", "true");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;