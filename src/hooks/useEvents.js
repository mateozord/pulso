import { useCallback, useEffect, useState } from 'react'
import { getEvents } from '../services/ticketmaster'

/**
 * Busca eventos e expõe o ciclo de vida da requisição como estado:
 * 'loading' -> 'success' | 'error'. A UI decide o que renderizar em
 * cada fase (skeleton, lista, ou mensagem de erro) olhando `status`.
 */
export function useEvents({
  city,
  keyword,
  genre,
  startDate,
  endDate,
  attractionId,
  size,
  sort,
  enabled = true,
} = {}) {
  const [status, setStatus] = useState(enabled ? 'loading' : 'idle')
  const [events, setEvents] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    // `enabled: false` existe pra casos como a página Artista: não faz
    // sentido buscar "eventos do artista X" antes de sabermos que o
    // artista X existe — evita uma chamada extra e desnecessária à API.
    if (!enabled) {
      setStatus('idle')
      return
    }

    let cancelled = false
    setStatus('loading')

    getEvents({ city, keyword, genre, startDate, endDate, attractionId, size, sort })
      .then((result) => {
        if (cancelled) return
        setEvents(result.events)
        setTotalPages(result.totalPages)
        setStatus('success')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setStatus('error')
      })

    // Evita "race condition": se a cidade mudar de novo antes da
    // primeira resposta chegar, ignoramos a resposta desatualizada.
    return () => {
      cancelled = true
    }
  }, [city, keyword, genre, startDate, endDate, attractionId, size, sort, enabled, retryCount])

  const retry = useCallback(() => setRetryCount((count) => count + 1), [])

  return { events, status, error, retry, totalPages }
}
