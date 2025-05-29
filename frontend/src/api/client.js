import axios from 'axios'

const isDev = import.meta.env.DEV
const baseURL = isDev ? '/api' : import.meta.env.VITE_API_URL + '/api'

const client = axios.create({
    // baseURL: "http://192.168.1.133:8000/api",
    baseURL,
    withCredentials: true,
})

// Attach token if present
client.interceptors.request.use((config) => {
    const token = localStorage.getItem('barpos-token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default client
