import api from './api'

export const getDashboard = () => api.get('/admin/dashboard')

export const getUsers = (params = {}) => api.get('/admin/users', { params })

export const getUserById = (id) => api.get(`/admin/users/${id}`)

export const addUser = (data) => api.post('/admin/users', data)

export const getStores = (params = {}) => api.get('/admin/stores', { params })

export const addStore = (data) => api.post('/admin/stores', data)
