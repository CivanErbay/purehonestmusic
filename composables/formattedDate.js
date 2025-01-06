export const formattedDate = (timestamp) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0'); // Tag immer zweistellig
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Monat immer zweistellig
  return `${day}.${month}`;
};
