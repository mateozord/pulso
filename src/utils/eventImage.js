/**
 * A Ticketmaster manda várias versões da mesma imagem (proporções e
 * larguras diferentes). Preferimos 16:9 e a maior largura disponível.
 */
export function getEventImage(event) {
  const images = event?.images ?? []
  if (images.length === 0) return null

  const wide = images.filter((img) => img.ratio === '16_9')
  const pool = wide.length > 0 ? wide : images

  return pool.reduce((best, img) => (img.width > (best?.width ?? 0) ? img : best), null)?.url ?? null
}
