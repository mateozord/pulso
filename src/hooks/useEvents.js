import { useCallback, useEffect, useState } from 'react'
import { getEvents } from '../services/ticketmaster'

/**
 * Busca eventos e expõe o ciclo de vida da requisição como estado:
 * 'loading' -> 'success' | 'error'. A UI decide o que renderizar em
 * cada fase (skeleton, lista, ou mensagem de erro) olhando `status`.
 */
export function useEvents({ city, keyword, genre, startDate, endDate, size, sort } = {}) {
  const [status, setStatus] = useState('loading')
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    getEvents({ city, keyword, genre, startDate, endDate, size, sort })
      .then((result) => {
        if (cancelled) return
        setEvents(result.events)
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
  }, [city, keyword, genre, startDate, endDate, size, sort, retryCount])

  const retry = useCallback(() => setRetryCount((count) => count + 1), [])

  return { events, status, error, retry }
}
