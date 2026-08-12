/**
 * Monta um endereço legível a partir do objeto `venue` da Ticketmaster
 * e um link de busca no Google Maps. Não usamos nenhuma API de mapas
 * — é só uma URL de busca, então não precisa de chave nem de conta.
 */
export function formatVenueAddress(venue) {
  if (!venue) return null

  const parts = [venue.address?.line1, venue.city?.name, venue.state?.stateCode].filter(Boolean)

  return parts.join(', ') || null
}

export function getMapsSearchUrl(venue) {
  if (!venue) return null

  const query = [venue.name, venue.address?.line1, venue.city?.name, venue.state?.stateCode]
    .filter(Boolean)
    .join(', ')
  if (!query) return null

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

/**
 * Rótulo curto de localização pra cards e listas. O campo `city` dos
 * locais brasileiros costuma vir vazio na Discovery API (ver
 * services/ticketmaster.js) — usamos a UF como substituto quando isso
 * acontece, em vez de mostrar um card sem nenhuma informação de lugar.
 */
export function getVenueLocationLabel(venue) {
  return venue?.city?.name || venue?.state?.stateCode || null
}
