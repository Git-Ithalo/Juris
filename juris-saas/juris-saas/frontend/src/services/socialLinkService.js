import api from './api'

export const socialLinkService = {
  list: () => api.get('/social-links').then((r) => r.data),
  create: (data) => api.post('/social-links', data).then((r) => r.data),
  remove: (id) => api.delete(`/social-links/${id}`),
}
