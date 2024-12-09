import { defineStore, storeToRefs } from 'pinia';

//TODO the whole favorite logic seems not work properly
export const useUsersStore = defineStore('users', () => {
  const user = reactive({
    name: '',
    email: '',
    id: '',
    roles: [],
    favoriteConcerts: [],
    favoriteLocations: [],
    isLoggedIn: false,
  });

  const loadFavorites = () => {
    const storedConcerts = localStorage.getItem('favoriteConcerts');
    if (storedConcerts) {
      user.favoriteConcerts = JSON.parse(storedConcerts);
    }
    const storedLocations = localStorage.getItem('favoriteLocations');
    if (storedLocations) {
      user.favoriteLocations = JSON.parse(storedLocations);
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

  const toggleFavoriteLocation = (locationId) => {
    const index = user.favoriteLocations.indexOf(locationId);
    if (index === -1) {
      user.favoriteLocations.push(locationId);
    } else {
      user.favoriteLocations.splice(index, 1);
    }
    localStorage.setItem(
      'favoriteLocations',
      JSON.stringify(user.favoriteLocations)
    );
  };

  const isConcertFavorite = (id) => {
    return user.favoriteConcerts.includes(id);
  };
  const isLocationFavorite = (id) => {
    return user.favoriteLocations.includes(id);
  };

  return {
    user,
    toggleFavoriteConcert,
    toggleFavoriteLocation,
    isConcertFavorite,
    isLocationFavorite,
    loadFavorites,
  };
});
