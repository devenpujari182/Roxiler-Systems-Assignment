import api from './axiosInstance';

export const submitRating = (data) => api.post('/ratings', data);
export const updateRating = (id, data) => api.put(`/ratings/${id}`, data);
