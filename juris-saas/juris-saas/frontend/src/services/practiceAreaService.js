import api from './api'

export const practiceAreaService = {
  list: () => api.get('/practice-areas').then((r) => r.data),
  create: (data) => api.post('/practice-areas', data).then((r) => r.data),
  update: (id, data) => api.put(`/practice-areas/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/practice-areas/${id}`),
}
