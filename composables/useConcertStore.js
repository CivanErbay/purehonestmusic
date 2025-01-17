import { defineStore } from 'pinia';
import { ref, watch } from 'vue'; // Add watch import
import { useUserStore } from './useUserStore'; // Ensure correct import

export const useConcertStore = defineStore('concerts', () => {
  const concerts = ref([]);
  const showUntilDaysFromNow = ref(7);
  const concertsPerPage = 100;
  const currentPage = ref(1);
  const totalConcerts = ref(0);

  const usersStore = useUserStore();

  const loadConcerts = async () => {
    if (concerts.value.length !== 0) return;
    const { data, meta } = await fetchCollectionHandler(
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

    totalConcerts.value = meta.totalDocs;
    concerts.value = data.value.map((concert) => ({
      ...concert,
      isUserFavorite: usersStore.user.favoriteConcerts.includes(concert.id),
    }));
  };

  const showMoreConcerts = () => {
    showUntilDaysFromNow.value += 7;
  };

  watch(
    () => showUntilDaysFromNow.value,
    async (newVal) => {
      const latestConcertDate = new Date(
        concerts.value[concerts.value.length - 1].date
      );
      const currentDatePlusDays = new Date();
      currentDatePlusDays.setDate(currentDatePlusDays.getDate() + newVal);
      currentDatePlusDays.setHours(0, 0, 0, 0);

      if (currentDatePlusDays >= latestConcertDate) {
        currentPage.value++;

        const { data } = await fetchCollectionHandler(
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

        concerts.value = [...concerts.value, ...data.value];
      }
    }
  );

  return {
    concerts,
    showUntilDaysFromNow,
    totalConcerts,
    loadConcerts,
    showMoreConcerts,
    currentPage,
  };
});
