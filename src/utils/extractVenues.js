/**
 * Não existe endpoint de "locais em alta" na API — então derivamos os
 * locais a partir dos próprios eventos já buscados, contando quantos
 * shows cada um tem nesse conjunto. Evita uma chamada extra à API.
 */
export function extractVenues(events, limit = 6) {
  const venueMap = new Map()

  for (const event of events) {
    const venue = event._embedded?.venues?.[0]
    if (!venue?.id) continue

    const existing = venueMap.get(venue.id)
    if (existing) {
      existing.eventCount += 1
    } else {
      venueMap.set(venue.id, {
        id: venue.id,
        name: venue.name,
        city: venue.city?.name,
        eventCount: 1,
      })
    }
  }

  return Array.from(venueMap.values())
    .sort((a, b) => b.eventCount - a.eventCount)
    .slice(0, limit)
}
