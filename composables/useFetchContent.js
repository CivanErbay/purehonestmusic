import qs from 'qs';

const API_URL = import.meta.env.VITE_API_ENDPOINT;

export const fetchCollectionHandler = async (collection, slug) => {
  let url;
  if (slug) {
    const query = qs.stringify({
      where: { slug: { equals: slug } },
    });
    url = `${API_URL}/${collection}?${query}`;
  } else {
    url = `${API_URL}/${collection}`;
  }

  const { data, status, error, refresh, clear } = await useFetch(url);
  const _data = computed(() => (slug ? data.value?.docs[0] : data.value?.docs));

  return { data: _data, status };
};

export const fetchGlobalHandler = async (slug) => {
  const url = `${API_URL}/globals/${slug}`;
  return await useFetch(url);
};
