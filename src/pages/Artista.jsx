import { useParams } from 'react-router-dom'
import { useArtist } from '../hooks/useArtist'
import { useEvents } from '../hooks/useEvents'
import { getBestImage } from '../utils/image'
import { getGenreLabel } from '../utils/genreLabel'
import Skeleton from '../components/Skeleton'
import StateMessage from '../components/StateMessage'
import EventRailSection from '../components/EventRailSection'
import './Artista.css'

function Artista() {
  const { id } = useParams()
  const { artist, status, error, retry } = useArtist(id)

  // Só busca os eventos depois que o artista existir de fato — evita
  // uma chamada extra e desnecessária à API enquanto isso não é sabido.
  const upcoming = useEvents({ attractionId: id, size: 12, enabled: status === 'success' })

  if (status === 'loading') {
    return (
      <section className="artista">
        <Skeleton className="artista__image-skeleton" />
        <div className="artista__body">
          <Skeleton style={{ width: '30%', height: '0.875rem' }} />
          <Skeleton style={{ width: '60%', height: '2.5rem', marginTop: '0.75rem' }} />
        </div>
      </section>
    )
  }

  if (status === 'not-found') {
    return (
      <StateMessage
        title="Esse artista não foi encontrado."
        description="O link pode estar errado ou o perfil pode ter sido removido."
        actionTo="/explorar"
        actionLabel="Ver shows"
      />
    )
  }

  if (status === 'error') {
    return <StateMessage title="Não conseguimos carregar esse artista." description={error} onRetry={retry} />
  }

  const image = getBestImage(artist)
  const genre = getGenreLabel(artist)

  return (
    <>
      <article className="artista">
        <div className="artista__image-wrap">
          {image ? (
            <img src={image} alt="" className="artista__image" />
          ) : (
            <div className="artista__image-fallback" aria-hidden="true">
              PULSO
            </div>
          )}
        </div>

        <div className="artista__body">
          {genre && <span className="artista__genre">{genre}</span>}
          <h1 className="artista__name">{artist.name}</h1>
          {artist.url && (
            <a href={artist.url} target="_blank" rel="noreferrer" className="artista__official-link">
              Perfil oficial na Ticketmaster
            </a>
          )}
        </div>
      </article>

      <EventRailSection
        layout="grid"
        title="Próximos eventos"
        status={upcoming.status}
        events={upcoming.events}
        error={upcoming.error}
        retry={upcoming.retry}
        emptyMessage={`Nenhum show de ${artist.name} encontrado no momento.`}
      />
    </>
  )
}

export default Artista
