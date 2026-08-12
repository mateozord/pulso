import { Link } from 'react-router-dom'
import { formatEventDate } from '../utils/formatDate'
import { getBestImage } from '../utils/image'
import { getVenueLocationLabel } from '../utils/venueAddress'
import FavoriteButton from './FavoriteButton'
import EventImage from './EventImage'
import './EventCard.css'

function EventCard({ event }) {
  const image = getBestImage(event)
  const venue = event._embedded?.venues?.[0]
  const date = formatEventDate(event.dates?.start?.localDate, event.dates?.start?.localTime)
  const location = getVenueLocationLabel(venue)

  return (
    <div className="event-card">
      <FavoriteButton event={event} className="event-card__favorite" />

      <Link to={`/evento/${event.id}`} className="event-card__link">
        <div className="event-card__image-wrap">
          <EventImage
            src={image}
            className="event-card__image"
            fallbackClassName="event-card__image-fallback"
            loading="lazy"
          />
        </div>
        <div className="event-card__body">
          <span className="event-card__date">{date}</span>
          <h3 className="event-card__name">{event.name}</h3>
          {venue && (
            <span className="event-card__venue">
              {venue.name}
              {location ? ` · ${location}` : ''}
            </span>
          )}
        </div>
      </Link>
    </div>
  )
}

export default EventCard
