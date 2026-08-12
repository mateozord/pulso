import { Link } from 'react-router-dom'
import { GENRES } from '../utils/genres'
import './GenreChips.css'

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
