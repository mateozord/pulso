import { createContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { useAuth } from '../hooks/useAuth'

export const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [status, setStatus] = useState('idle') // 'idle' (deslogado) | 'loading' | 'ready'

  // Roda de novo sempre que o usuário muda (login/logout) — é assim
  // que os favoritos trocam pra conta certa, ou somem ao sair.
  useEffect(() => {
    if (!user) {
      setFavorites([])
      setStatus('idle')
      return
    }

    let cancelled = false
    setStatus('loading')

    supabase
      .from('favorites')
      .select('event_data')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error('Erro ao carregar favoritos:', error.message)
          setFavorites([])
        } else {
          setFavorites(data.map((row) => row.event_data))
        }
        setStatus('ready')
      })

    return () => {
      cancelled = true
    }
  }, [user])

  function isFavorite(id) {
    return favorites.some((event) => event.id === id)
  }

  // Atualização otimista: a tela reage na hora, antes da resposta do
  // banco chegar. Se der erro, desfazemos — mais responsivo do que
  // esperar a rede pra cada favorito, ao custo de um rollback raro.
  async function addFavorite(event) {
    if (!user) return

    setFavorites((current) => (current.some((e) => e.id === event.id) ? current : [...current, event]))

    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: user.id, event_id: event.id, event_data: event })

    if (error) {
      console.error('Erro ao favoritar:', error.message)
      setFavorites((current) => current.filter((e) => e.id !== event.id))
    }
  }

  async function removeFavorite(id) {
    if (!user) return

    const previous = favorites
    setFavorites((current) => current.filter((event) => event.id !== id))

    const { error } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('event_id', id)

    if (error) {
      console.error('Erro ao remover favorito:', error.message)
      setFavorites(previous)
    }
  }

  function toggleFavorite(event) {
    if (isFavorite(event.id)) {
      removeFavorite(event.id)
    } else {
      addFavorite(event)
    }
  }

  const value = { favorites, status, isFavorite, addFavorite, removeFavorite, toggleFavorite }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
