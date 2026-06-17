import api from './axiosInstance';

export const getOwnerDashboard = (params) =>
  api.get('/store-owner/dashboard', { params });
