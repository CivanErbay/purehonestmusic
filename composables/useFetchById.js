const backendUrl = import.meta.env.VITE_API_ENDPOINT;
const API_URL = backendUrl + '/api';

export const useFetchById = async (collection, id) => {
  const url = `${API_URL}/${collection}/${id}`;
  const {data, status, error, refresh, clear} = await useFetch(url);

  return {data, status};
};
