import api from './api'

export const websiteService = {
  getMine: () => api.get('/website').then((r) => r.data),
  update: (data) => api.put('/website', data).then((r) => r.data),
  publish: () => api.post('/website/publish').then((r) => r.data),
  unpublish: () => api.post('/website/unpublish').then((r) => r.data),
  getPublic: (slug) => api.get(`/public/website/${slug}`).then((r) => r.data),
}
