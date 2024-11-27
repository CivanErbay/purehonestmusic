import { defineStore, storeToRefs } from 'pinia';

export const useUsersStore = defineStore('users', () => {
  const user = reactive({
    name: '',
    email: '',
    id: '',
    roles: [],
    favoriteConcerts: [],
    isLoggedIn: false,
  });

  const loadFavoriteConcerts = () => {
    const storedConcerts = localStorage.getItem('favoriteConcerts');
    if (storedConcerts) {
      user.favoriteConcerts = JSON.parse(storedConcerts);
    }
  };

  const toggleFavoriteConcert = (concertId) => {
    const index = user.favoriteConcerts.indexOf(concertId);
    if (index === -1) {
      user.favoriteConcerts.push(concertId);
    } else {
      user.favoriteConcerts.splice(index, 1);
    }
    localStorage.setItem(
      'favoriteConcerts',
      JSON.stringify(user.favoriteConcerts)
    );
  };

  const isConcertFavorite = (concertId) => {
    return user.favoriteConcerts.includes(concertId);
  };

  onMounted(() => {
    loadFavoriteConcerts();
  });

  return {
    user,
    toggleFavoriteConcert,
    isConcertFavorite,
  };
});
