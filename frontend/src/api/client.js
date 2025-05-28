import axios from "axios";

const client = axios.create({
    baseURL: "http://localhost:8000/api",
});

// Attach token if present
client.interceptors.request.use((config) => {
    const token = localStorage.getItem("barpos-token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default client;