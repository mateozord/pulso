import { useState } from 'react'
import { useEvents } from '../hooks/useEvents'
import CitySelector from '../components/CitySelector'
import SearchBar from '../components/SearchBar'
import EventCard from '../components/EventCard'
import { EventCardSkeleton } from '../components/Skeleton'
import StateMessage from '../components/StateMessage'
import './Home.css'

function Home() {
  const [city, setCity] = useState('São Paulo')
  const [keyword, setKeyword] = useState('')
  const { events, status, error, retry } = useEvents({ city, keyword })

  return (
    <>
      <section className="hero">
        <h1 className="hero__title">O que toca na sua cidade?</h1>
        <p className="hero__subtitle">
          Descubra shows, artistas e noites que você não sabia que estavam acontecendo.
        </p>
        <div className="hero__controls">
          <CitySelector value={city} onChange={setCity} />
          <SearchBar onSearch={setKeyword} />
        </div>
      </section>

      <section className="home-section">
        <h2 className="home-section__title">Em destaque{keyword ? ` · "${keyword}"` : ` em ${city}`}</h2>

        {status === 'loading' && (
          <div className="event-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        )}

        {status === 'error' && (
          <StateMessage
            title="Não conseguimos carregar os shows agora."
            description={error}
            onRetry={retry}
          />
        )}

        {status === 'success' && events.length === 0 && (
          <StateMessage
            title="Nenhum show encontrado."
            description={`Não achamos eventos em ${city}${keyword ? ` para "${keyword}"` : ''}. Tente outra cidade ou termo de busca.`}
          />
        )}

        {status === 'success' && events.length > 0 && (
          <div className="event-grid">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export default Home
