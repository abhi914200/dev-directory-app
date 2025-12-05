import api from './api';

// List with search/filter/sort/pagination
export const fetchDevelopers = async ({
  search = '',
  role = '',
  sortBy = 'experience',
  sortOrder = 'desc',
  page = 1,
  limit = 6
} = {}) => {
  const params = {};

  if (search) params.search = search;
  if (role) params.role = role;
  if (sortBy) params.sortBy = sortBy;
  if (sortOrder) params.sortOrder = sortOrder;
  if (page) params.page = page;
  if (limit) params.limit = limit;

  console.log(params);

  const res = await api.get('/api/developers', { params });
  return res.data; // { data: [...], pagination: {...} }
};

export const getDeveloperById = async (id) => {
  const res = await api.get(`/api/developers/${id}`);
  return res.data; // single developer
};

export const createDeveloper = async (payload) => {
  const res = await api.post('/api/developers', payload);
  return res.data; // created developer
};

export const updateDeveloper = async (id, payload) => {
  const res = await api.put(`/api/developers/${id}`, payload);
  return res.data; // updated developer
};

export const deleteDeveloper = async (id) => {
  const res = await api.delete(`/api/developers/${id}`);
  return res.data;
};
