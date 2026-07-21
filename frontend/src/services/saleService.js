import API from "./api";

const API_URL = "/sales";

export const getSales = async () => {
  const response = await API.get(API_URL);
  return response.data;
};

export const getSaleById = async (id) => {
  const response = await API.get(`${API_URL}/${id}`);
  return response.data;
};

export const createSale = async (saleData) => {
  const response = await API.post(API_URL, saleData);
  return response.data;
};

export const updateSale = async (id, saleData) => {
  const response = await API.put(`${API_URL}/${id}`, saleData);
  return response.data;
};

export const deleteSale = async (id) => {
  const response = await API.delete(`${API_URL}/${id}`);
  return response.data;
};