import { useAuth } from '../hooks/useAuth'
import { useFavorites } from '../hooks/useFavorites'
import EventCard from '../components/EventCard'
import { EventCardSkeleton } from '../components/Skeleton'
import StateMessage from '../components/StateMessage'
import Reveal from '../components/Reveal'
import './Favoritos.css'

function Favoritos() {
  const { user } = useAuth()
  const { favorites, status } = useFavorites()

  if (!user) {
    return (
      <StateMessage
        title="Entre pra ver seus favoritos."
        description="Os favoritos agora ficam salvos na sua conta — funcionam em qualquer aparelho, não só neste navegador."
        actionTo="/login"
        actionLabel="Entrar"
      />
    )
  }

  return (
    <Reveal as="section" className="favoritos">
      <h1>Favoritos</h1>

      {status === 'loading' && (
        <div className="favoritos__grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      )}

      {status === 'ready' && favorites.length === 0 && (
        <StateMessage
          title="Você ainda não favoritou nenhum show."
          description="Toque no coração de um evento pra salvá-lo aqui."
          actionTo="/explorar"
          actionLabel="Explorar shows"
        />
      )}

      {status === 'ready' && favorites.length > 0 && (
        <div className="favoritos__grid">
          {favorites.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </Reveal>
  )
}

export default Favoritos
