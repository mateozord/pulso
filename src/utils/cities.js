/**
 * Curadoria própria das cidades suportadas, com coordenadas de
 * referência (fato geográfico, não dado vindo de nenhuma API) usadas
 * pra busca por raio — ver comentário em services/ticketmaster.js
 * sobre por que não usamos o parâmetro `city` da Discovery API.
 */
const CITY_COORDINATES = {
  'São Paulo': { lat: -23.5505, lng: -46.6333 },
  'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
  'Belo Horizonte': { lat: -19.9167, lng: -43.9345 },
  Curitiba: { lat: -25.4284, lng: -49.2733 },
  'Porto Alegre': { lat: -30.0346, lng: -51.2177 },
  Salvador: { lat: -12.9714, lng: -38.5014 },
  Recife: { lat: -8.0476, lng: -34.877 },
  Brasília: { lat: -15.7939, lng: -47.8828 },
}

export const CITIES = Object.keys(CITY_COORDINATES)

export function getCityCoordinates(city) {
  return CITY_COORDINATES[city] ?? null
}
