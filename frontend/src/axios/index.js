import axios from 'axios'

const api = axios.create({
  // En desarrollo usa '/api' (el proxy de Vite lo reenvia al backend local).
  // En produccion (Render) apunta a la URL completa del backend, que se define
  // en la variable de entorno VITE_API_URL al momento del build.
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor: adjunta el token JWT a cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['x-token'] = token
  }
  return config
})

// Interceptor: maneja errores de respuesta globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
