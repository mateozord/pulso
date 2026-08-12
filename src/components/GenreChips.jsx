import { Link } from 'react-router-dom'
import './GenreChips.css'

// Curadoria própria de gêneros pra navegação — não vem de nenhum
// endpoint da API, é só um atalho de busca por texto no Explorar.
const GENRES = ['Rock', 'Pop', 'Eletrônica', 'Hip-Hop', 'MPB', 'Sertanejo', 'Funk', 'Indie', 'Reggae', 'Jazz']

function GenreChips() {
  return (
    <div className="genre-chips">
      {GENRES.map((genre) => (
        <Link key={genre} to={`/explorar?genero=${encodeURIComponent(genre)}`} className="genre-chip">
          {genre}
        </Link>
      ))}
    </div>
  )
}

export default GenreChips
