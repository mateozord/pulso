/**
 * Atrasa a execução de `fn` até que `wait` ms tenham se passado sem
 * novas chamadas. Usado na busca para não disparar uma requisição a
 * cada tecla digitada.
 */
export function debounce(fn, wait = 400) {
  let timeoutId

  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), wait)
  }
}
