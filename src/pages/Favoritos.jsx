import { useFavorites } from '../hooks/useFavorites'
import EventCard from '../components/EventCard'
import StateMessage from '../components/StateMessage'
import Reveal from '../components/Reveal'
import './Favoritos.css'

function Favoritos() {
  const { favorites } = useFavorites()

  return (
    <Reveal as="section" className="favoritos">
      <h1>Favoritos</h1>

      {favorites.length === 0 ? (
        <StateMessage
          title="Você ainda não favoritou nenhum show."
          description="Toque no coração de um evento pra salvá-lo aqui — mesmo depois de fechar o navegador."
          actionTo="/explorar"
          actionLabel="Explorar shows"
        />
      ) : (
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
