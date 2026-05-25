import api from './axios';

export const registerSiswa    = (data) => api.post('/register/siswa', data);
export const registerGuru     = (data) => api.post('/register/guru', data);
export const getPublicSchools = ()     => api.get('/public/schools');
