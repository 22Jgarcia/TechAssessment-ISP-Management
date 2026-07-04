import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7210/api',
    headers: { 'Content-Type': 'application/json' }
})

api.interceptors.response.use(
    response => response,
    error => {
        const mensaje = 
            error.response?.data?.detail ||
            error.response?.data?.message ||
            error.message ||
            'Ocurrió un error desconocido';
        console.error('Error en la respuesta:', mensaje);
        return Promise.reject(new Error(mensaje));
    }
)

export default api;
