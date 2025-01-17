import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchCollectionHandler } from '@/composables/useFetchContent';

export const useConcertStore = defineStore('concerts', () => {
  const concerts = ref([]);
  const venues = ref([]);
  const genres = ref([]);
  const promoters = ref([]);
  const displayConcertsCount = ref(10);
  const totalConcertCount = ref(0);
  const concertsPerPage = 1000;
  const currentPage = ref(0);

  const setConcerts = (data) => {
    concerts.value = data;
  };

  const addConcerts = (data) => {
    concerts.value = [...concerts.value, ...data];
  };

  const setVenues = (data) => {
    venues.value = data;
  };

  const setGenres = (data) => {
    genres.value = data;
  };

  const setPromoters = (data) => {
    promoters.value = data;
  };

  const setDisplayConcertsCount = (count) => {
    displayConcertsCount.value = count;
  };

  const fetchAllData = async () => {
    const concertsPromise = fetchCollectionHandler(
      'concerts',
      null,
      concertsPerPage,
      currentPage.value,
      {
        sort: 'date',
        where: {
          date: {
            greater_than: new Date(
              new Date().setHours(0, 0, 0, 0)
            ).toISOString(),
          },
        },
      }
    );
    const venuesPromise = fetchCollectionHandler('venues');
    const genresPromise = fetchCollectionHandler('genres');
    const promotersPromise = fetchCollectionHandler('promoters');

    const { data: concerts } = await concertsPromise;
    const { data: venues } = await venuesPromise;
    const { data: genres } = await genresPromise;
    const { data: promoters } = await promotersPromise;

    setConcerts(concerts);
    totalConcertCount.value = concerts.value.length;
    setVenues(venues);
    setGenres(genres);
    setPromoters(promoters);
  };

  return {
    concerts,
    venues,
    genres,
    promoters,
    displayConcertsCount,
    totalConcertCount,
    setConcerts,
    addConcerts,
    setVenues,
    setGenres,
    setPromoters,
    setDisplayConcertsCount,
    fetchAllData,
  };
});
