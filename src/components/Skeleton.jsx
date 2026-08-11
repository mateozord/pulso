import './Skeleton.css'

/**
 * Bloco genérico de "esqueleto" — reutilizado em qualquer lugar que
 * precise sugerir o formato do conteúdo enquanto ele carrega.
 */
function Skeleton({ className = '', style }) {
  return <div className={`skeleton ${className}`} style={style} aria-hidden="true" />
}

export function EventCardSkeleton() {
  return (
    <div className="event-card-skeleton">
      <Skeleton className="event-card-skeleton__image" />
      <div className="event-card-skeleton__body">
        <Skeleton style={{ width: '40%', height: '0.8125rem' }} />
        <Skeleton style={{ width: '80%', height: '1.0625rem' }} />
        <Skeleton style={{ width: '55%', height: '0.8125rem' }} />
      </div>
    </div>
  )
}

export default Skeleton
