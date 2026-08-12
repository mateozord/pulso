/**
 * Eventos e artistas ("attractions") trazem o gênero na mesma
 * estrutura `classifications[0].genre.name`. A Ticketmaster usa o
 * literal "Undefined" quando não há gênero definido — tratamos como
 * ausência, não como um gênero de verdade.
 */
export function getGenreLabel(entity) {
  const genre = entity?.classifications?.[0]?.genre?.name
  if (!genre || genre === 'Undefined') return null
  return genre
}
