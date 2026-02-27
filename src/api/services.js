import api from './axiosInstance';

// Auth
export const register = (data) => api.post('/api/auth/register', data);
export const login = (data) => api.post('/api/auth/login', data);

// Pets
export const getPets = (params) => api.get('/api/pets', { params });
export const getPet = (id) => api.get(`/api/pets/${id}`);
export const createPet = (data) => api.post('/api/pets', data);
export const updatePet = (id, data) => api.put(`/api/pets/${id}`, data);
export const deletePet = (id) => api.delete(`/api/pets/${id}`);

// Applications
export const submitApplication = (petId) =>
    api.post('/api/applications', { petId });

export const getMyApplications = () =>
    api.get('/api/applications/my-applications');

export const getAllApplications = (params) =>
    api.get('/api/applications', { params });

export const updateApplicationStatus = (id, status) =>
    api.put(`/api/applications/${id}`, { status });
