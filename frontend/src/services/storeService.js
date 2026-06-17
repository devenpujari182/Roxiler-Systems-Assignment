import api from './api'

export const getStores = (params = {}) => api.get('/stores', { params })
