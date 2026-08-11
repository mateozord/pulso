import { Link } from 'react-router-dom'
import { formatEventDate } from '../utils/formatDate'
import { getEventImage } from '../utils/eventImage'
import './EventCard.css'

function EventCard({ event }) {
  const image = getEventImage(event)
  const venue = event._embedded?.venues?.[0]
  const date = formatEventDate(event.dates?.start?.localDate, event.dates?.start?.localTime)

  return (
    <Link to={`/evento/${event.id}`} className="event-card">
      <div className="event-card__image-wrap">
        {image ? (
          <img src={image} alt="" className="event-card__image" loading="lazy" />
        ) : (
          <div className="event-card__image-fallback" aria-hidden="true">
            PULSO
          </div>
        )}
      </div>
      <div className="event-card__body">
        <span className="event-card__date">{date}</span>
        <h3 className="event-card__name">{event.name}</h3>
        {venue && (
          <span className="event-card__venue">
            {venue.name}
            {venue.city?.name ? ` · ${venue.city.name}` : ''}
          </span>
        )}
      </div>
    </Link>
  )
}

export default EventCard
