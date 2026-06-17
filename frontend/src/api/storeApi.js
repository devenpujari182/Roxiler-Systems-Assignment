import api from './axiosInstance';

export const getStores = (params) => api.get('/stores', { params });
