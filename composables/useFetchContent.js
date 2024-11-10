import qs from 'qs';

const API_URL = import.meta.env.VITE_API_ENDPOINT;

export const fetchCollectionHandler = async (
  collection,
  slug,
  limit = 1000,
  page = 0
) => {
  let url;
  const query = {
    limit,
    page,
  };

  if (slug) {
    query.where = { slug: { equals: slug } };
  }

  const queryString = qs.stringify(query);
  url = `${API_URL}/${collection}?${queryString}`;

  const { data, status, error, refresh, clear } = await useFetch(url);
  const _data = computed(() => (slug ? data.value?.docs[0] : data.value?.docs));

  return { data: _data, status };
};

export const fetchGlobalHandler = async (slug) => {
  const url = `${API_URL}/globals/${slug}`;
  return await useFetch(url);
};
