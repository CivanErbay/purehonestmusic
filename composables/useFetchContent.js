import qs from 'qs';

const backendUrl = import.meta.env.VITE_API_ENDPOINT;
const API_URL = backendUrl + '/api';

export const useFetchPage = async (slug = '') => {
  const query = qs.stringify({
    where: { slug: { equals: slug } },
  });
  const url = `${API_URL}/pages?${query}`;
  const { data, status, error, refresh, clear } = await useFetch(url);
  const page = data.value?.docs[0];

  return { page, status };
};

// TODO pagination, pick fields for overview
export const useFetchConcerts = async () => {
  const url = `${API_URL}/concerts`;
  const { data, status, error, refresh, clear } = await useFetch(url);
  const projects = data.value?.docs;

  return { projects, status };
};

export const useFetchConcert = async (slug) => {
  const query = qs.stringify({
    where: { slug: { equals: slug } },
  });
  const url = `${API_URL}/concerts?${query}`;
  const { data, status, error, refresh, clear } = await useFetch(url);
  const project = data.value?.docs[0];

  return { project, status };
};

export const useFetchLanding = async () => {
  const url = `${API_URL}/globals/landing`;
  const { data, status, error, refresh, clear } = await useFetch(url);

  return { landing: data, status };
};
