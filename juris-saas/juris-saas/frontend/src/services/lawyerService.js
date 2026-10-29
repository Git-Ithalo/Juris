import api from './api'

export const lawyerService = {
  list: () => api.get('/lawyers').then((r) => r.data),
  create: (data) => api.post('/lawyers', data).then((r) => r.data),
  update: (id, data) => api.put(`/lawyers/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/lawyers/${id}`),
}
