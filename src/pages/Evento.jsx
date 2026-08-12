import { Link, useParams } from 'react-router-dom'
import { useEvent } from '../hooks/useEvent'
import { formatEventDate } from '../utils/formatDate'
import { getEventImage } from '../utils/eventImage'
import { formatVenueAddress, getMapsSearchUrl } from '../utils/venueAddress'
import Skeleton from '../components/Skeleton'
import StateMessage from '../components/StateMessage'
import './Evento.css'

function getGenreLabel(event) {
  const genre = event.classifications?.[0]?.genre?.name
  if (!genre || genre === 'Undefined') return null
  return genre
}

function Evento() {
  const { id } = useParams()
  const { event, status, error, retry } = useEvent(id)

  if (status === 'loading') {
    return (
      <section className="evento">
        <Skeleton className="evento__image-skeleton" />
        <div className="evento__body">
          <Skeleton style={{ width: '30%', height: '0.875rem' }} />
          <Skeleton style={{ width: '70%', height: '2.5rem', marginTop: '0.75rem' }} />
          <Skeleton style={{ width: '50%', height: '1rem', marginTop: '1rem' }} />
        </div>
      </section>
    )
  }

  if (status === 'not-found') {
    return (
      <StateMessage
        title="Esse show não existe ou não está mais disponível."
        description="O link pode estar errado ou o evento pode ter sido removido."
        actionTo="/explorar"
        actionLabel="Ver outros shows"
      />
    )
  }

  if (status === 'error') {
    return <StateMessage title="Não conseguimos carregar esse evento." description={error} onRetry={retry} />
  }

  const image = getEventImage(event)
  const venue = event._embedded?.venues?.[0]
  const attraction = event._embedded?.attractions?.[0]
  const date = formatEventDate(event.dates?.start?.localDate, event.dates?.start?.localTime)
  const genre = getGenreLabel(event)
  const address = formatVenueAddress(venue)
  const mapsUrl = getMapsSearchUrl(venue)
  const description = event.info || event.pleaseNote

  return (
    <article className="evento">
      <div className="evento__image-wrap">
        {image ? (
          <img src={image} alt="" className="evento__image" />
        ) : (
          <div className="evento__image-fallback" aria-hidden="true">
            PULSO
          </div>
        )}
      </div>

      <div className="evento__body">
        {genre && <span className="evento__genre">{genre}</span>}
        <h1 className="evento__name">{event.name}</h1>
        <p className="evento__date">{date}</p>

        {attraction && (
          <Link to={`/artista/${attraction.id}`} className="evento__artist-link">
            Ver página do artista: {attraction.name}
          </Link>
        )}

        <div className="evento__info-grid">
          {venue && (
            <div className="evento__info-block">
              <h2 className="evento__info-title">Local</h2>
              <p>{venue.name}</p>
              {address && <p className="evento__muted">{address}</p>}
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noreferrer" className="evento__maps-link">
                  Ver no mapa
                </a>
              )}
            </div>
          )}

          {description && (
            <div className="evento__info-block">
              <h2 className="evento__info-title">Sobre o evento</h2>
              <p className="evento__muted">{description}</p>
            </div>
          )}
        </div>

        <div className="evento__actions">
          {event.url && (
            <a href={event.url} target="_blank" rel="noreferrer" className="evento__ticket-link">
              Ingressos oficiais
            </a>
          )}
          <span className="evento__source">Fonte: Ticketmaster</span>
        </div>
      </div>
    </article>
  )
}

export default Evento
