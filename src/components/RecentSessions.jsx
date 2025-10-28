'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import DeleteSessionButton from '@/components/DeleteSessionButton'
import EditSessionButton from '@/components/EditSessionButton'

const RecentSessions = ({currentMonthName, totalSessionsInCurrentMonth, lastFiveSessions}) => {
  const [message, setMessage] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

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
            <div className='flex flex-col w-full max-h-[calc(100vh-350px)]'>
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
              
              <div className='text-lg flex flex-row-reverse font-bold px-5 py-2 text-gray-500'>
                Total sessions in {currentMonthName} : {totalSessionsInCurrentMonth}
              </div>
              <div className='text-xl font-bold px-5 py-2 bg-slate-700 text-white shadow border-b border-gray-300'>
                Your recent sessions
              </div>
    
              <div
                className='w-full overflow-auto shadow-xl bg-white flex-1'
                id='journal-scroll'
              >
                <table className='w-full'>
                  <tbody className=''>
                    {lastFiveSessions && lastFiveSessions.map(session => (
                    <tr key={session.sessionId}
                      className='relative transform scale-100
                                              text-sm py-1 border-b-2 border-blue-100 cursor-default'
                    >
                      <td className='pl-2 whitespace-no-wrap'>
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
                          <strong>Student:</strong> {session.students !== 'N/A' ? session.students : 'N/A'}
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
                    ))}
                  </tbody>
                </table>
              </div>  
            </div>
          </div>
        </div>
  )
}

export default RecentSessions