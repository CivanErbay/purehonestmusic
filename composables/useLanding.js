// composables/useLanding.js
export const useLanding = async () => {
  // geteilter, clientseitiger Cache
  const landing = useState('landing', () => null)

  // nur laden, wenn noch nicht im Cache
  if (!landing.value) {
    const { data } = await fetchGlobalHandler('landing')
    landing.value = data.value
  }

  // Angleichen an das gewohnte API-Shape
  return { data: landing }
}
