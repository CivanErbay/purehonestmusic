const maxSubtitleLength = 300

export const truncateSubtitle = (subtitle) => {
  if (subtitle.length > maxSubtitleLength) {
    return subtitle.slice(0, maxSubtitleLength) + '...'
  }
  return subtitle
}