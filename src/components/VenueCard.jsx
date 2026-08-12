import './VenueCard.css'

function VenueCard({ venue }) {
  return (
    <div className="venue-card">
      <h3 className="venue-card__name">{venue.name}</h3>
      {venue.city && <span className="venue-card__city">{venue.city}</span>}
      <span className="venue-card__count">
        {venue.eventCount} {venue.eventCount === 1 ? 'show' : 'shows'} esta semana
      </span>
    </div>
  )
}

export default VenueCard
