import api from './api'

export const companyService = {
  getMine: () => api.get('/companies/me').then((r) => r.data),
  update: (data) => api.put('/companies/me', data).then((r) => r.data),
}
