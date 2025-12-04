// src/servicios/api.ts
import axios, { AxiosInstance, AxiosError } from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api: AxiosInstance = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            console.error("Error de respuesta:", error.response.data);
        } else if (error.request) {
            console.error("Error de petición:", error.request);
        } else {
            console.error("Error:", error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
