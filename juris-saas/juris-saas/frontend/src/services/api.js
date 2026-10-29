import axios from 'axios'

// URL do backend. Em produção, isso vem de uma variável de ambiente do Vite
// (VITE_API_URL), definida no serviço de deploy (Vercel/Netlify/etc.).
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({ baseURL })

// Anexa o token JWT (quando existir) em todas as requisições.
// O token será salvo no localStorage após o login (Etapa 3).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
