'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import DeleteSessionButton from '@/components/DeleteSessionButton'
import EditSessionButton from '@/components/EditSessionButton'

const RecentSessions = ({sortedSessions}) => {
  const [message, setMessage] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [timeFilter, setTimeFilter] = useState('all')
  const [modeFilter, setModeFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // Get unique time slots from sessions data
  const uniqueTimeSlots = [...new Set(
    sortedSessions?.map(session => {
      const start = new Date(session.start);
      const end = new Date(session.end);
      const startTime = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      const endTime = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      return `${startTime} - ${endTime}`;
    }) || []
  )].sort((a, b) => {
    // Sort by start time
    const getTimeValue = (timeStr) => {
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/);
      if (!match) return 0;
      let hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const isPM = match[3] === 'PM';
      if (isPM && hours !== 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };
    return getTimeValue(a) - getTimeValue(b);
  });

  // Filter sessions based on selected filters
  const filteredSessions = sortedSessions?.filter(session => {
    const start = new Date(session.start);
    const end = new Date(session.end);
    const sessionTimeSlot = `${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    
    // Time filter - exact match with time slot
    const timeMatch = timeFilter === 'all' || sessionTimeSlot === timeFilter;
    
    // Mode filter
    const modeMatch = modeFilter === 'all' || session.mode === modeFilter;
    
    // Type filter
    const typeMatch = typeFilter === 'all' || session.sessionType === typeFilter;
    
    return timeMatch && modeMatch && typeMatch;
  }) || []

  const handleCallback = (success, msg) => {
    setIsSuccess(success)
    setMessage(msg)
    
    // Hide message after 2 seconds
    setTimeout(() => {
      setMessage(null)
    }, 2000)
  }

  const handleLoadingChange = (loading) => {
    setIsDeleting(loading)
  }

  return (
        <div className='relative'>
          {/* Spinner Overlay */}
          {isDeleting && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
              <div className='bg-white rounded-lg p-6 flex flex-col items-center gap-4'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
                <p className='text-gray-700 font-medium'>Deleting session...</p>
              </div>
            </div>
          )}
          
        <div className='container mx-auto flex justify-center'>
            <div className='flex flex-col w-full'>
              {isSuccess && message && (
                <motion.div
            className='flex w-full items-start bg-green-100 text-green-600 p-3 mb-8 rounded-lg relative lg:flex'
            role='alert'
              animate={{ opacity: [1, 0, 1] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: 'loop',
              }}
          >
            <div className="bg-green-500 text-white font-semibold tracking-wide flex items-center w-full p-4 rounded-md shadow-md shadow-green-100" role="alert">
              <div className="shrink-0 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-white inline" viewBox="0 0 512 512">
                  <ellipse cx="256" cy="256" fill="#fff" data-original="#fff" rx="256" ry="255.832" />
                  <path className="fill-green-600"
                    d="m235.472 392.08-121.04-94.296 34.416-44.168 74.328 57.904 122.672-177.016 46.032 31.888z"
                    data-original="#ffffff" />
                </svg>
              </div>
              <span className="text-[15px] mr-3">{message}</span>
            </div>
          </motion.div>
              )}
              
              <div className='text-xl font-bold px-6 py-4 bg-gradient-to-r from-slate-600 to-slate-800 rounded-t-lg text-white shadow border-b border-gray-300 flex justify-between items-center'>
                <span>Recent sessions</span>
                {filteredSessions && filteredSessions.length > 0 && (
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className='text-sm bg-white text-slate-700 px-4 py-2 rounded hover:bg-gray-100 transition-colors flex items-center gap-2'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>
                )}
              </div>

              {/* Filters */}
              {showFilters && filteredSessions && filteredSessions.length > 0 && (
              <div className='bg-gray-50 px-5 py-3 border-b border-gray-300 flex flex-wrap gap-3 items-center'>
                <div className='flex items-center gap-2'>
                  <label className='text-sm font-medium text-gray-700 w-12'>Time:</label>
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className='border border-gray-300 rounded px-1 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48'
                  >
                    <option value='all'>All Times</option>
                    {uniqueTimeSlots.map((timeSlot, index) => (
                      <option key={index} value={timeSlot}>
                        {timeSlot}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='flex items-center gap-2'>
                  <label className='text-sm font-medium text-gray-700 w-12'>Mode:</label>
                  <select
                    value={modeFilter}
                    onChange={(e) => setModeFilter(e.target.value)}
                    className='border border-gray-300 rounded px-1 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48'
                  >
                    <option value='all'>All</option>
                    <option value='online'>Online</option>
                    <option value='offline'>Offline</option>
                  </select>
                </div>

                <div className='flex items-center gap-2'>
                  <label className='text-sm font-medium text-gray-700 w-12'>Type:</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className='border border-gray-300 rounded px-1 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48'
                  >
                    <option value='all'>All</option>
                    <option value='onlinepersonal'>Personal</option>
                    <option value='onlineprenatal'>Prenatal</option>
                    <option value='offlinegeneral'>General</option>
                    <option value='offlinepersonal'>Personal</option>
                    <option value='offlineprenatal'>Semi-Prenatal</option>
                    <option value='offlinesemiprivate'>Semi-Private</option>
                    <option value='offlinekids'>Kids</option>
                    <option value='offlineteens'>Teens</option>
                    <option value='offlineseniors'>Seniors</option>
                  </select>
                </div>

                {(timeFilter !== 'all' || modeFilter !== 'all' || typeFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setTimeFilter('all')
                      setModeFilter('all')
                      setTypeFilter('all')
                    }}
                    className='text-sm text-blue-600 hover:text-blue-800 font-medium underline'
                  >
                    Clear Filters
                  </button>
                )}
              </div>
              )}
    
              <div
                className='w-full overflow-auto shadow-xl bg-white flex-1'
                id='journal-scroll'
              >
                <table className='w-full'>
                  <tbody className=''>                    
                    {filteredSessions && filteredSessions.length > 0 ? (
                      filteredSessions.map(session => (
                    <tr key={session.sessionId}
                      className='relative transform scale-100
                                              text-sm py-1 border-b-2 border-blue-100 cursor-default'
                    >
                      <td className='pl-4 lg:pl-6 whitespace-no-wrap'>
                        <div className='text-gray-400'>{new Date(session.date).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        <div>{new Date(session.start).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric'})} to  {new Date(session.end).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' })}</div>
                      </td>
    
                      <td className='px-1 py-2 flex flex-col gap-2 whitespace-no-wrap'>
                        <div className='leading-5 text-gray-900 capitalize'>
                          <strong>Mode:</strong> {session.mode}
                        </div>
                        <div className='leading-5 text-gray-900 capitalize'>
                          <strong>Type:</strong> {session.sessionType.replace(/(Offline|Online)/gi, '').trim()}
                        </div>
                        <div className='leading-5 text-gray-900 capitalize'>
                          <strong>Student:</strong> {session.students !== 'N/A' ? <span className='bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full'>{session.students}</span> : 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className='pb-2'>
                        <EditSessionButton 
                          session={session} 
                          onEdit={handleCallback}
                        />
                        </div>
                        <div className='pt-2'>
                        <DeleteSessionButton 
                          sessionId={session?.sessionId} 
                          onDelete={handleCallback}
                          onLoadingChange={handleLoadingChange}
                        />
                        </div>
                      </td>
                    </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan='3' className='px-5 py-8 text-center text-gray-500'>
                          No sessions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>  
            </div>
          </div>
        </div>
  )
}

export default RecentSessions