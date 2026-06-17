import api from './api'

export const getOwnerDashboard = (params = {}) => api.get('/store-owner/dashboard', { params })
