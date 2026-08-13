import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useEvents } from '../hooks/useEvents'
import { getEvents } from '../services/ticketmaster'
import { getDateRangeFromToday } from '../utils/dateRange'
import { GENRES } from '../utils/genres'
import CitySelector from '../components/CitySelector'
import SearchBar from '../components/SearchBar'
import EventRailSection from '../components/EventRailSection'
import Dropdown from '../components/Dropdown'
import { usePageTitle } from '../hooks/usePageTitle'
import './Explorar.css'

const PAGE_SIZE = 24

const GENRE_OPTIONS = [{ value: '', label: 'Todos os gêneros' }, ...GENRES.map((genre) => ({ value: genre, label: genre }))]

const PERIODS = [
  { value: 'qualquer', label: 'Qualquer data' },
  { value: 'hoje', label: 'Hoje' },
  { value: 'semana', label: 'Esta semana' },
  { value: 'mes', label: 'Este mês' },
]

function getPeriodRange(period) {
  if (period === 'hoje') return getDateRangeFromToday(1)
  if (period === 'semana') return getDateRangeFromToday(7)
  if (period === 'mes') return getDateRangeFromToday(30)
  return { startDate: undefined, endDate: undefined }
}

function Explorar() {
  usePageTitle('Explorar')
  const [searchParams, setSearchParams] = useSearchParams()

  // A URL é a fonte de verdade dos filtros: ao entrar via link (ex.:
  // os chips de gênero da Home) a página já nasce filtrada, e o link
  // atual pode ser compartilhado com os mesmos filtros aplicados.
  const [city, setCity] = useState(searchParams.get('cidade') ?? '')
  const [genre, setGenre] = useState(searchParams.get('genero') ?? '')
  const [period, setPeriod] = useState(searchParams.get('periodo') ?? 'qualquer')
  const [keyword, setKeyword] = useState(searchParams.get('busca') ?? '')

  useEffect(() => {
    const next = {}
    if (city) next.cidade = city
    if (genre) next.genero = genre
    if (period !== 'qualquer') next.periodo = period
    if (keyword) next.busca = keyword
    setSearchParams(next, { replace: true })
  }, [city, genre, period, keyword, setSearchParams])

  const { startDate, endDate } = useMemo(() => getPeriodRange(period), [period])
  const { events, status, error, retry, totalPages } = useEvents({
    city,
    genre,
    keyword,
    startDate,
    endDate,
    size: PAGE_SIZE,
  })

  // Páginas extras carregadas via "Carregar mais". Ficam separadas de
  // `events` (a página 0, controlada pelo useEvents) porque trocar um
  // filtro deve *substituir* os resultados, mas clicar em "carregar
  // mais" deve *somar* — dois comportamentos diferentes o bastante
  // pra não valer a pena forçar dentro do hook genérico.
  const [extraEvents, setExtraEvents] = useState([])
  const [page, setPage] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    setExtraEvents([])
    setPage(0)
  }, [city, genre, keyword, startDate, endDate])

  async function handleLoadMore() {
    const nextPage = page + 1
    setLoadingMore(true)
    try {
      const result = await getEvents({ city, genre, keyword, startDate, endDate, size: PAGE_SIZE, page: nextPage })
      setExtraEvents((current) => [...current, ...result.events])
      setPage(nextPage)
    } catch {
      // Falha ao carregar mais não deve derrubar os resultados que já
      // estão na tela — a pessoa pode simplesmente tentar de novo.
    } finally {
      setLoadingMore(false)
    }
  }

  const allEvents = [...events, ...extraEvents]
  const hasMore = page + 1 < totalPages

  return (
    <>
      <section className="explorar-header">
        <h1>Explorar</h1>
        <div className="explorar-filters">
          <CitySelector value={city} onChange={setCity} allowAll />

          <Dropdown value={genre} onChange={setGenre} options={GENRE_OPTIONS} ariaLabel="Gênero" />

          <Dropdown value={period} onChange={setPeriod} options={PERIODS} ariaLabel="Período" />

          <SearchBar onSearch={setKeyword} defaultValue={keyword} />
        </div>
      </section>

      <EventRailSection
        layout="grid"
        title={status === 'success' ? `${allEvents.length} ${allEvents.length === 1 ? 'resultado' : 'resultados'}` : 'Resultados'}
        status={status}
        events={allEvents}
        error={error}
        retry={retry}
        emptyMessage="Nenhum show encontrado com esses filtros. Tente ampliar a busca."
      />

      {status === 'success' && hasMore && (
        <div className="explorar-load-more">
          <button type="button" className="explorar-load-more__button" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? 'Carregando...' : 'Carregar mais'}
          </button>
        </div>
      )}
    </>
  )
}

export default Explorar
