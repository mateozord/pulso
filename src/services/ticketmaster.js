// Chamamos nosso próprio proxy (/api/ticketmaster), não a Ticketmaster
// diretamente: a API dela não permite CORS a partir do navegador. O
// proxy (configurado em vite.config.js) injeta a apikey no lado do
// servidor, então ela nunca aparece no código que roda no navegador.
const BASE_URL = '/api/ticketmaster'

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
    if (response.status === 401) {
      throw new Error('Chave de API inválida ou não autorizada.')
    }
    if (response.status === 429) {
      throw new Error('Limite de requisições da API atingido. Tente novamente em instantes.')
    }
    throw new Error(`Erro ao buscar dados (status ${response.status}).`)
  }

  return response.json()
}

/**
 * Busca eventos musicais. A Discovery API não devolve `_embedded`
 * quando não há resultados, por isso o `?? []` abaixo.
 */
export async function getEvents({
  city,
  keyword,
  genre,
  startDate,
  endDate,
  size = 20,
  page = 0,
  sort = 'date,asc',
} = {}) {
  const data = await request('/events.json', {
    city,
    keyword,
    // `||` (não `??`) de propósito: genre='' (opção "todos os gêneros"
    // no filtro) também deve cair no padrão 'music', não virar string vazia.
    classificationName: genre || 'music',
    startDateTime: startDate,
    endDateTime: endDate,
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
