import EventCard from './EventCard'
import { EventCardSkeleton } from './Skeleton'
import StateMessage from './StateMessage'
import Reveal from './Reveal'
import './EventRailSection.css'

/**
 * Uma seção de eventos que resolve os três estados de carregamento
 * (skeleton / erro / vazio / sucesso) uma única vez. `layout` decide
 * só a apresentação: 'grid' pro bloco principal, 'rail' pra carrossel
 * horizontal com scroll-snap.
 */
function EventRailSection({ title, status, events, error, retry, emptyMessage, layout = 'rail' }) {
  const containerClass = layout === 'grid' ? 'event-grid' : 'rail'
  const skeletonCount = layout === 'grid' ? 8 : 4

  return (
    <Reveal as="section" className="home-section">
      <h2 className="home-section__title">{title}</h2>

      {status === 'loading' && (
        <div className={containerClass}>
          {Array.from({ length: skeletonCount }).map((_, index) =>
            layout === 'rail' ? (
              <div className="rail__item" key={index}>
                <EventCardSkeleton />
              </div>
            ) : (
              <EventCardSkeleton key={index} />
            ),
          )}
        </div>
      )}

      {status === 'error' && (
        <StateMessage title="Não conseguimos carregar essa seção." description={error} onRetry={retry} />
      )}

      {status === 'success' && events.length === 0 && <StateMessage title={emptyMessage} />}

      {status === 'success' && events.length > 0 && (
        <div className={containerClass}>
          {events.map((event) =>
            layout === 'rail' ? (
              <div className="rail__item" key={event.id}>
                <EventCard event={event} />
              </div>
            ) : (
              <EventCard key={event.id} event={event} />
            ),
          )}
        </div>
      )}
    </Reveal>
  )
}

export default EventRailSection
