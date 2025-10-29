export const getSessionStats = (sessions, currentMonth) => {
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  const totalSessionsInCurrentMonth = sessions.filter(session => 
    new Date(session.date).getMonth() === currentMonth
  ).length

  return {
    sortedSessions,
    totalSessionsInCurrentMonth
  }
}