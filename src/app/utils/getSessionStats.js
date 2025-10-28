const RECENT_SESSIONS_LIMIT = 5
export const getSessionStats = (sessions, currentMonth) => {
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  const lastFiveSessions = sortedSessions.slice(0, RECENT_SESSIONS_LIMIT)

  const totalSessionsInCurrentMonth = sessions.filter(session => 
    new Date(session.date).getMonth() === currentMonth
  ).length

  return {
    lastFiveSessions,
    totalSessionsInCurrentMonth
  }
}