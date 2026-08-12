import { useCallback, useEffect, useState } from 'react'
import { getAttractionById } from '../services/ticketmaster'

/**
 * Mesmo padrão do useEvent, agora pro endpoint /attractions/{id} —
 * é como a Ticketmaster chama artistas, times e outros "atrativos".
 */
export function useArtist(id) {
  const [status, setStatus] = useState('loading')
  const [artist, setArtist] = useState(null)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    getAttractionById(id)
      .then((data) => {
        if (cancelled) return
        setArtist(data)
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

  return { artist, status, error, retry }
}
