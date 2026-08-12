/**
 * A Discovery API espera startDateTime/endDateTime no formato
 * "AAAA-MM-DDTHH:mm:ssZ" (UTC). Calculamos a janela "hoje até daqui
 * 7 dias" para a seção "Acontecendo esta semana".
 */
export function getThisWeekRange() {
  const now = new Date()
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  return {
    startDate: toTicketmasterUTC(now),
    endDate: toTicketmasterUTC(in7Days),
  }
}

function toTicketmasterUTC(date) {
  return date.toISOString().split('.')[0] + 'Z'
}
