/**
 * A Discovery API espera startDateTime/endDateTime no formato
 * "AAAA-MM-DDTHH:mm:ssZ" (UTC). getDateRangeFromToday cobre "hoje até
 * daqui N dias" — usado tanto na Home ("esta semana") quanto nos
 * filtros de período do Explorar.
 */
export function getDateRangeFromToday(days) {
  const now = new Date()
  const end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

  return {
    startDate: toTicketmasterUTC(now),
    endDate: toTicketmasterUTC(end),
  }
}

export function getThisWeekRange() {
  return getDateRangeFromToday(7)
}

function toTicketmasterUTC(date) {
  return date.toISOString().split('.')[0] + 'Z'
}
