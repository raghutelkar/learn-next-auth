'use client'

import { useState } from 'react'

const TotalSummary = ({currentMonthName, totalSessionsInCurrentMonth, sortedSessions}) => {
  const [expandedTimeSlot, setExpandedTimeSlot] = useState(null)

  // Group sessions by time slot
  const sessionsByTime = {}
  
  sortedSessions?.forEach(session => {
    const start = new Date(session.start)
    const end = new Date(session.end)
    const timeSlot = `${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
    
    if (!sessionsByTime[timeSlot]) {
      sessionsByTime[timeSlot] = {
        total: 0,
        byMode: { online: 0, offline: 0 },
        byType: {},
        sessions: []
      }
    }
    
    sessionsByTime[timeSlot].total++
    sessionsByTime[timeSlot].byMode[session.mode]++
    sessionsByTime[timeSlot].byType[session.sessionType] = (sessionsByTime[timeSlot].byType[session.sessionType] || 0) + 1
    sessionsByTime[timeSlot].sessions.push(session)
  })

  // Sort time slots chronologically
  const sortedTimeSlots = Object.keys(sessionsByTime).sort((a, b) => {
    const getTimeValue = (timeStr) => {
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/)
      if (!match) return 0
      let hours = parseInt(match[1])
      const minutes = parseInt(match[2])
      const isPM = match[3] === 'PM'
      if (isPM && hours !== 12) hours += 12
      if (!isPM && hours === 12) hours = 0
      return hours * 60 + minutes
    }
    return getTimeValue(a) - getTimeValue(b)
  })

  // Calculate overall statistics
  const overallStats = {
    totalOnline: sortedSessions?.filter(s => s.mode === 'online').length || 0,
    totalOffline: sortedSessions?.filter(s => s.mode === 'offline').length || 0,
    byType: {}
  }
  
  sortedSessions?.forEach(session => {
    overallStats.byType[session.sessionType] = (overallStats.byType[session.sessionType] || 0) + 1
  })

  const formatTypeName = (type) => {
    // First replace offline/online to add proper spacing
    let formatted = type
      .replace(/offline/gi, 'Offline ')
      .replace(/online/gi, 'Online ')
      .trim()
    
    // Then capitalize each word
    return formatted
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  return (
    <div className='container mx-auto'>
      <div className='bg-white rounded-lg shadow-xl'>
        {/* Header */}
        <div className='bg-gradient-to-r from-slate-600 to-slate-800 text-white px-6 py-4 rounded-t-lg'>
          <h2 className='text-xl font-bold'>Session Summary - {currentMonthName}</h2>
          { sortedTimeSlots.length > 0 && (<p className='text-blue-100 mt-1'>Total Sessions: {totalSessionsInCurrentMonth}</p> )}
        </div>

        {/* Overall Statistics */}
        {sortedTimeSlots.length > 0 ? (
        <>
        <div className='p-6 border-b border-gray-200'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>Overall Statistics</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
              <div className='flex items-center justify-between'>
                <span className='text-gray-700 font-medium'>Online Sessions</span>
                <span className='text-2xl font-bold text-green-600'>{overallStats.totalOnline}</span>
              </div>
            </div>
            <div className='bg-purple-50 border border-purple-200 rounded-lg p-4'>
              <div className='flex items-center justify-between'>
                <span className='text-gray-700 font-medium'>Offline Sessions</span>
                <span className='text-2xl font-bold text-yellow-600'>{overallStats.totalOffline}</span>
              </div>
            </div>
          </div>

          {/* Session Types Breakdown */}
          <h4 className='text-md font-semibold text-gray-700 mb-3'>By Session Type</h4>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
            {Object.entries(overallStats.byType).map(([type, count]) => (
              <div key={type} className='bg-gray-50 border border-gray-200 rounded px-3 py-2 flex justify-between items-center'>
                <span className='text-sm text-gray-700 capitalize'>{formatTypeName(type)}</span>
                <span className='font-semibold text-blue-600'>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Time Slot Breakdown */}
        <div className='p-6'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>Breakdown by Time Slot</h3>
          <div className='space-y-3'>
            {sortedTimeSlots.map((timeSlot) => {
              const data = sessionsByTime[timeSlot]
              const isExpanded = expandedTimeSlot === timeSlot
              
              return (
                <div key={timeSlot} className='border border-gray-200 rounded-lg overflow-hidden'>
                  {/* Time Slot Header */}
                  <button
                    onClick={() => setExpandedTimeSlot(isExpanded ? null : timeSlot)}
                    className='w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between'
                  >
                    <div className='flex items-center gap-4'>
                      <span className='font-semibold text-gray-800'>{timeSlot}</span>
                      <span className='bg-yellow-500 text-white text-sm px-3 py-1 rounded-full'>
                        {data.total} {data.total === 1 ? 'session' : 'sessions'}
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                    </svg>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className='px-4 py-3 bg-white border-t border-gray-200'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                        {/* Mode Breakdown */}
                        <div>
                          <h5 className='text-sm font-semibold text-gray-700 mb-2'>By Mode</h5>
                          <div className='space-y-2'>
                            <div className='flex justify-between items-center bg-green-50 px-3 py-2 rounded'>
                              <span className='text-sm text-gray-700'>Online</span>
                              <span className='font-semibold text-green-600'>{data.byMode.online}</span>
                            </div>
                            <div className='flex justify-between items-center bg-purple-50 px-3 py-2 rounded'>
                              <span className='text-sm text-gray-700'>Offline</span>
                              <span className='font-semibold text-yellow-600'>{data.byMode.offline}</span>
                            </div>
                          </div>
                        </div>

                        {/* Type Breakdown */}
                        <div>
                          <h5 className='text-sm font-semibold text-gray-700 mb-2'>By Type</h5>
                          <div className='space-y-2'>
                            {Object.entries(data.byType).map(([type, count]) => (
                              <div key={type} className='flex justify-between items-center bg-blue-50 px-3 py-2 rounded'>
                                <span className='text-sm text-gray-700 capitalize'>{formatTypeName(type)}</span>
                                <span className='font-semibold text-yellow-600'>{count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Students if applicable */}
                      <div>
                        <h5 className='text-sm font-semibold text-gray-700 mb-2'>Students</h5>
                        <div className='flex flex-wrap gap-2'>
                          {[...new Set(data.sessions.map(s => s.students).filter(s => s !== 'N/A'))].map((student, idx) => (
                            <span key={idx} className='bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full'>
                              {student}
                            </span>
                          ))}
                          {data.sessions.filter(s => s.students === 'N/A').length > 0 && (
                            <span className='bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full'>
                              N/A
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        </>
        ): (
            <div className='text-center py-8 text-gray-500'>
              No sessions found
            </div>
        )}
      </div>
    </div>
  )
}

export default TotalSummary