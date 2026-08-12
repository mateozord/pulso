import { createContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'pulso:favoritos'

export const FavoritesContext = createContext(null)

function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    // localStorage corrompido, bloqueado (modo anônimo restrito) ou
    // indisponível — começamos vazio em vez de quebrar o app.
    return []
  }
}

export function FavoritesProvider({ children }) {
  // O `useState(readFromStorage)` (passando a função, não o resultado)
  // garante que a leitura do localStorage rode só uma vez, na
  // primeira renderização — não a cada render.
  const [favorites, setFavorites] = useState(readFromStorage)

  // Sempre que a lista mudar, persiste de novo. É assim que o
  // favorito sobrevive a um F5: na próxima vez que o app carregar,
  // `readFromStorage` acima já devolve os dados salvos aqui.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // Ex.: modo anônimo com localStorage bloqueado. Falha silenciosa
      // é aceitável aqui — o app continua funcionando, só não persiste.
    }
  }, [favorites])

  function isFavorite(id) {
    return favorites.some((event) => event.id === id)
  }

  function addFavorite(event) {
    setFavorites((current) => (current.some((e) => e.id === event.id) ? current : [...current, event]))
  }

  function removeFavorite(id) {
    setFavorites((current) => current.filter((event) => event.id !== id))
  }

  function toggleFavorite(event) {
    if (isFavorite(event.id)) {
      removeFavorite(event.id)
    } else {
      addFavorite(event)
    }
  }

  const value = { favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
