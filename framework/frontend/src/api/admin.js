import api from './axios';

export const getSppgs  = (params)    => api.get('/admin/sppg', { params });
export const createSppg = (data)     => api.post('/admin/sppg', data);
export const updateSppg = (id, data) => api.put(`/admin/sppg/${id}`, data);
export const deleteSppg   = (id)       => api.delete(`/admin/sppg/${id}`);
export const activateSppg = (id)       => api.put(`/admin/sppg/${id}`, { is_active: true });

export const getSchools       = (params) => api.get('/admin/schools', { params });
export const getSchoolProvinces = ()     => api.get('/admin/schools/provinces');
export const createSchool     = (data)   => api.post('/admin/schools', data);
export const updateSchool     = (id, data) => api.put(`/admin/schools/${id}`, data);
export const deleteSchool     = (id)     => api.delete(`/admin/schools/${id}`);

export const syncSppgSchools = (sppgId, schoolIds) =>
  api.put(`/admin/sppg/${sppgId}/schools/sync`, { school_ids: schoolIds });
