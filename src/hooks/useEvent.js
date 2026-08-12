import { useCallback, useEffect, useState } from 'react'
import { getEventById } from '../services/ticketmaster'

/**
 * Mesma ideia do useEvents, mas pra um único evento. O status
 * 'not-found' é separado de 'error' porque a UI trata os dois de
 * forma bem diferente: "esse show não existe" não tem botão de
 * "tentar de novo" — tentar de novo não vai fazer o evento aparecer.
 */
export function useEvent(id) {
  const [status, setStatus] = useState('loading')
  const [event, setEvent] = useState(null)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    getEventById(id)
      .then((data) => {
        if (cancelled) return
        setEvent(data)
        setStatus('success')
      })
      .catch((err) => {
        if (cancelled) return
        if (err.status === 404) {
          setStatus('not-found')
        } else {
          setError(err.message)
          setStatus('error')
        }
      })

    return () => {
      cancelled = true
    }
  }, [id, retryCount])

  const retry = useCallback(() => setRetryCount((count) => count + 1), [])

  return { event, status, error, retry }
}
