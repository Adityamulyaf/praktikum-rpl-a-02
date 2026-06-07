import api from './axios';

export const registerSiswa      = (data) => api.post('/register/siswa', data);
export const registerGuru       = (data) => api.post('/register/guru', data);
export const searchPublicSchools = (q)  => api.get('/public/schools', { params: { q } });
export const verifyNisn          = (nisn) => api.get('/public/verify-nisn', { params: { nisn } });
