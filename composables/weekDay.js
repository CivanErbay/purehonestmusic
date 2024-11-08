const weekdays = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
]

export const weekDay = (timestamp) => {
  const date = new Date(timestamp)
  const today = new Date()
  const dayOfWeek = weekdays[date.getDay()]

  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return `Heute`
  } else {
    return `${dayOfWeek}`
  }
}
