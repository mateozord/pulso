import { getCityCoordinates } from '../utils/cities'

// Chamamos nosso próprio proxy (/api/ticketmaster), não a Ticketmaster
// diretamente: a API dela não permite CORS a partir do navegador. O
// proxy (configurado em vite.config.js) injeta a apikey no lado do
// servidor, então ela nunca aparece no código que roda no navegador.
const BASE_URL = '/api/ticketmaster'

// Raio de busca ao redor do centro de cada cidade. Grande o bastante
// pra cobrir a região metropolitana, pequeno o bastante pra não
// invadir a cidade vizinha da nossa lista curada.
const CITY_SEARCH_RADIUS_KM = 50

async function request(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin)
  url.searchParams.set('countryCode', 'BR')

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  }

  let response
  try {
    response = await fetch(url)
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique sua internet.')
  }

  if (!response.ok) {
    // Guardamos o status HTTP no próprio erro (não só na mensagem) pra
    // quem chamar `request` conseguir distinguir "não encontrado" (404)
    // de outros tipos de falha, sem precisar analisar texto.
    const error = new Error(errorMessageFor(response.status))
    error.status = response.status
    throw error
  }

  return response.json()
}

function errorMessageFor(status) {
  if (status === 401) return 'Chave de API inválida ou não autorizada.'
  if (status === 404) return 'Não encontrado.'
  if (status === 429) return 'Limite de requisições da API atingido. Tente novamente em instantes.'
  return `Erro ao buscar dados (status ${status}).`
}

/**
 * Busca eventos musicais. A Discovery API não devolve `_embedded`
 * quando não há resultados, por isso o `?? []` abaixo.
 *
 * Sobre `city`: descobrimos testando com dados reais que o campo
 * `venue.city` vem vazio pros locais brasileiros na Discovery API —
 * ou seja, o parâmetro de busca `city` (que filtra por esse campo)
 * não retorna nada pro Brasil, mesmo quando o evento existe. As
 * coordenadas do local (`venue.location`), porém, vêm preenchidas
 * corretamente. Por isso resolvemos o nome da cidade pra coordenadas
 * (ver utils/cities.js) e fazemos busca por raio (`latlong`+`radius`)
 * em vez de busca por texto.
 */
export async function getEvents({
  city,
  keyword,
  genre,
  startDate,
  endDate,
  attractionId,
  size = 20,
  page = 0,
  sort = 'date,asc',
} = {}) {
  const coordinates = city ? getCityCoordinates(city) : null

  const data = await request('/events.json', {
    keyword,
    attractionId,
    // `||` (não `??`) de propósito: genre='' (opção "todos os gêneros"
    // no filtro) também deve cair no padrão 'music', não virar string vazia.
    classificationName: genre || 'music',
    startDateTime: startDate,
    endDateTime: endDate,
    latlong: coordinates ? `${coordinates.lat},${coordinates.lng}` : undefined,
    radius: coordinates ? CITY_SEARCH_RADIUS_KM : undefined,
    unit: coordinates ? 'km' : undefined,
    size,
    page,
    sort,
  })

  return {
    events: data._embedded?.events ?? [],
    totalPages: data.page?.totalPages ?? 0,
    totalElements: data.page?.totalElements ?? 0,
  }
}

export async function getEventById(id) {
  return request(`/events/${id}.json`)
}

export async function getAttractionById(id) {
  return request(`/attractions/${id}.json`)
}
