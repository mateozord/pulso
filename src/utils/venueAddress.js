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

  const query = [venue.name, venue.address?.line1, venue.city?.name].filter(Boolean).join(', ')
  if (!query) return null

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
