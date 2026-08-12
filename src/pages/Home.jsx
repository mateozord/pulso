import { useMemo, useState } from 'react'
import { useEvents } from '../hooks/useEvents'
import { getThisWeekRange } from '../utils/dateRange'
import { extractVenues } from '../utils/extractVenues'
import CitySelector from '../components/CitySelector'
import SearchBar from '../components/SearchBar'
import EventRailSection from '../components/EventRailSection'
import VenueCard from '../components/VenueCard'
import GenreChips from '../components/GenreChips'
import Reveal from '../components/Reveal'
import PulseLine from '../components/PulseLine'
import LiveDot from '../components/LiveDot'
import { usePageTitle } from '../hooks/usePageTitle'
import './Home.css'

function Home() {
  usePageTitle()
  const [city, setCity] = useState('São Paulo')
  const [keyword, setKeyword] = useState('')

  const featured = useEvents({ city, keyword })

  // useMemo evita recalcular a janela de datas a cada render — só
  // precisa mudar quando a cidade mudar (novo fetch de qualquer jeito).
  const { startDate, endDate } = useMemo(() => getThisWeekRange(), [city])
  const thisWeek = useEvents({ city, startDate, endDate, size: 12 })

  const trending = useEvents({ city, sort: 'relevance,desc', size: 12 })

  const venues = useMemo(() => extractVenues(thisWeek.events), [thisWeek.events])

  return (
    <>
      <Reveal as="section" className="hero">
        <h1 className="hero__title">O que toca na sua cidade?</h1>
        <p className="hero__subtitle">
          Descubra shows, artistas e noites que você não sabia que estavam acontecendo.
        </p>
        <div className="hero__controls">
          <CitySelector value={city} onChange={setCity} />
          <SearchBar onSearch={setKeyword} />
        </div>
        <PulseLine className="hero__pulse" />
      </Reveal>

      <EventRailSection
        layout="grid"
        title={`Em destaque${keyword ? ` · "${keyword}"` : ` em ${city}`}`}
        status={featured.status}
        events={featured.events}
        error={featured.error}
        retry={featured.retry}
        emptyMessage={`Nenhum show encontrado em ${city}${keyword ? ` para "${keyword}"` : ''}. Tente outra cidade ou termo de busca.`}
      />

      <EventRailSection
        title="Acontecendo esta semana"
        status={thisWeek.status}
        events={thisWeek.events}
        error={thisWeek.error}
        retry={thisWeek.retry}
        emptyMessage={`Nenhum show encontrado em ${city} nos próximos 7 dias.`}
      />

      <EventRailSection
        title={
          <>
            <LiveDot />
            Em alta
          </>
        }
        status={trending.status}
        events={trending.events}
        error={trending.error}
        retry={trending.retry}
        emptyMessage={`Nenhum destaque encontrado em ${city} no momento.`}
      />

      <Reveal as="section" className="home-section">
        <h2 className="home-section__title">Explore por gênero</h2>
        <GenreChips />
      </Reveal>

      {venues.length > 0 && (
        <Reveal as="section" className="home-section">
          <h2 className="home-section__title">Lugares que estão pulsando</h2>
          <div className="rail">
            {venues.map((venue) => (
              <div className="rail__item" key={venue.id}>
                <VenueCard venue={venue} />
              </div>
            ))}
          </div>
        </Reveal>
      )}
    </>
  )
}

export default Home
