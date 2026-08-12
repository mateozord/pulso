import { useFavorites } from '../hooks/useFavorites'
import './FavoriteButton.css'

function FavoriteButton({ event, className = '' }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const active = isFavorite(event.id)

  function handleClick(clickEvent) {
    // O botão costuma ficar dentro (visualmente) de um card clicável;
    // sem isso, favoritar também dispararia a navegação do card.
    clickEvent.preventDefault()
    clickEvent.stopPropagation()
    toggleFavorite(event)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`favorite-button ${active ? 'favorite-button--active' : ''} ${className}`}
      aria-pressed={active}
      aria-label={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <path
          d="M12 20.5s-7.5-4.6-10-9.3C.5 7.8 2.4 4.5 6 4.5c2 0 3.6 1.1 6 3.5 2.4-2.4 4-3.5 6-3.5 3.6 0 5.5 3.3 4 6.7-2.5 4.7-10 9.3-10 9.3Z"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

export default FavoriteButton
