/**
 * A Ticketmaster devolve datas como string separada: "2026-09-12" + "20:00:00".
 * Convertemos pro formato de exibição em pt-BR.
 */
export function formatEventDate(localDate, localTime) {
  if (!localDate) return 'Data a confirmar'

  const [year, month, day] = localDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  const formatted = date.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })

  if (!localTime) return formatted

  const [hour, minute] = localTime.split(':')
  return `${formatted} · ${hour}h${minute}`
}
