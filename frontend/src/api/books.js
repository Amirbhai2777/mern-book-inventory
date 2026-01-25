import client from './client';

export const listBooks = async (params) => {
  const { data } = await client.get('/books', { params });
  return data;
};

export const getBook = async (id) => {
  const { data } = await client.get(`/books/${id}`);
  return data;
};

export const createBook = async (payload) => {
  const { data } = await client.post('/books', payload);
  return data;
};

export const updateBook = async (id, payload) => {
  const { data } = await client.put(`/books/${id}`, payload);
  return data;
};

export const deleteBook = async (id) => {
  const { data } = await client.delete(`/books/${id}`);
  return data;
};
