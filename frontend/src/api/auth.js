import client from './client';

export const loginApi = async (identifier, password, role = 'customer') => {
  const response = await client.post('/auth/login', { identifier, password, role });
  return response.data;
};

export const registerApi = async (userData) => {
  const response = await client.post('/auth/register', userData);
  return response.data;
};

export const forgotPasswordApi = async (phone_number, new_password, role = 'customer') => {
  const response = await client.post('/auth/forgot-password', { phone_number, new_password, role });
  return response.data;
};

export const fetchProfileApi = async (phone) => {
  const response = await client.get(`/auth/profile/${encodeURIComponent(phone)}`);
  return response.data;
};

export const updateProfileApi = async (phone, updateData) => {
  const response = await client.put(`/auth/profile/${encodeURIComponent(phone)}`, updateData);
  return response.data;
};