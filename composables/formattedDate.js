export const formattedDate = (timestamp) => {
  const date = new Date(timestamp)
  const day = date.getDate()
  const month = date.getMonth() + 1
  return `${day}.${month}`
}
