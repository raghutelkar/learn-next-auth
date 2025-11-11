'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'motion/react'

const StudentsList = () => {
  const router = useRouter()
  const [studentsList, setStudentsList] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [filterMode, setFilterMode] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isDeleting, setIsDeleting] = useState(null)
  const [deleteSuccess, setDeleteSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Fetch students on mount
  const fetchStudents = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/addStudent')
      if (response.ok) {
        const data = await response.json()
        setStudentsList(data.students || [])
        setFilteredStudents(data.students || [])
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents()
  }, [])

  // Filter students based on mode, type, and search query
  useEffect(() => {
    let filtered = studentsList

    // Filter by mode
    if (filterMode !== 'all') {
      filtered = filtered.filter(student => student.mode === filterMode)
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(student => student.sessionType.includes(filterType))
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(student =>
        student.studentName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredStudents(filtered)
  }, [studentsList, filterMode, filterType, searchQuery])

  const handleDeleteStudent = async (studentId) => {
    if (!confirm('Are you sure you want to delete this student?')) {
      return
    }

    setIsDeleting(studentId)
    try {
      const response = await fetch(`/api/addStudent?studentId=${studentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setDeleteSuccess(true)
        setTimeout(() => setDeleteSuccess(false), 2000)
        await fetchStudents()
      } else {
        const errorMessage = await response.text()
        setError(errorMessage || 'Failed to delete student')
        setTimeout(() => setError(''), 5000)
      }
    } catch (error) {
      console.error('Error deleting student:', error)
      setError('Error deleting student. Please try again.')
      setTimeout(() => setError(''), 5000)
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className='relative'>
      {/* Spinner Overlay */}
      {isDeleting && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 flex flex-col items-center gap-4'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
            <p className='text-gray-700 font-medium'>Deleting student...</p>
          </div>
        </div>
      )}
      
      <div className='container mx-auto flex justify-center mt-14 px-4 lg:px-0'>
        <div className='flex flex-col w-full'>
          {error && (
            <motion.div
              className='flex items-start bg-red-100 text-red-800 p-3 mb-4 rounded-lg relative lg:flex'
              role='alert'
              animate={{ opacity: [1, 0, 1] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: 'loop',
              }}
            >
              <div className='flex items-center gap-3'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-5 h-5 shrink-0 fill-red-500 inline'
                  viewBox='0 0 32 32'
                >
                  <path
                    d='M16 1a15 15 0 1 0 15 15A15 15 0 0 0 16 1zm6.36 20L21 22.36l-5-4.95-4.95 4.95L9.64 21l4.95-5-4.95-4.95 1.41-1.41L16 14.59l5-4.95 1.41 1.41-5 4.95z'
                    data-original='#ea2d3f'
                  />
                </svg>
                <span className='font-semibold text-[14px] inline-block mr-2'>
                  Error!
                </span>
                <span className='block text-sm font-medium sm:inline'>{error}</span>
              </div>
            </motion.div>
          )}
          
          {deleteSuccess && (
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
                    <ellipse cx="256" cy="256" fill="#fff" rx="256" ry="255.832" />
                    <path className="fill-green-600" d="m235.472 392.08-121.04-94.296 34.416-44.168 74.328 57.904 122.672-177.016 46.032 31.888z" />
                  </svg>
                </div>
                <span className="text-[15px] mr-3">Student deleted successfully</span>
              </div>
            </motion.div>
          )}

          <div className='text-xl font-bold px-6 py-4 bg-gradient-to-r from-slate-600 to-slate-800 rounded-t-lg text-white shadow border-b border-gray-300 flex justify-between items-center'>
            <span>All Students</span>
            {studentsList && studentsList.length > 0 && (
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
          {showFilters && studentsList && studentsList.length > 0 && (
            <div className='bg-gray-50 px-5 py-3 border-b border-gray-300 flex flex-wrap gap-3 items-center'>
              <div className='flex items-center gap-2'>
                <label className='text-sm font-medium text-gray-700 w-12'>Search:</label>
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search student name...'
                  className='border border-gray-300 rounded px-1 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48'
                />
              </div>

              <div className='flex items-center gap-2'>
                <label className='text-sm font-medium text-gray-700 w-12'>Mode:</label>
                <select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value)}
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
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className='border border-gray-300 rounded px-1 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48'
                >
                  <option value='all'>All</option>
                  <option value='personal'>Personal</option>
                  <option value='prenatal'>Prenatal</option>
                </select>
              </div>

              {(filterMode !== 'all' || filterType !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setFilterMode('all')
                    setFilterType('all')
                    setSearchQuery('')
                  }}
                  className='text-sm text-blue-600 hover:text-blue-800 font-medium underline'
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          <div className='w-full overflow-auto shadow-xl bg-white flex-1' id='journal-scroll'>
            <table className='w-full'>
              <tbody className=''>
                {isLoading ? (
                  <tr>
                    <td colSpan='2' className='px-5 py-8'>
                      <div className='flex justify-center items-center'>
                        <svg
                          className='animate-spin h-8 w-8 text-gray-600'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents && filteredStudents.length > 0 ? (
                  filteredStudents.map((student, idx) => (
                    <tr
                      key={student.studentId}
                      className='relative transform scale-100 text-sm py-1 border-b-2 border-blue-100 cursor-default'
                    >
                      <td className='pl-4 lg:pl-6 whitespace-no-wrap'>
                        {idx + 1}.
                      </td>
                      <td className='pl-4 lg:pl-6 whitespace-no-wrap'>
                        <div className='text-gray-900 font-medium text-base'>{student.studentName}</div>
                      </td>

                      <td className='px-1 py-2 flex flex-col gap-2 whitespace-no-wrap'>
                        <div className='leading-5 text-gray-900 capitalize'>
                          <strong>Mode:</strong> {student.mode}
                        </div>
                        <div className='leading-5 text-gray-900 capitalize'>
                          <strong>Type:</strong> {student.sessionType.replace('online', '').replace('offline', '').trim()}
                        </div>
                      </td>

                      <td>
                        <div className='pt-2'>
                           <button className="mr-4" title="Delete" onClick={() => handleDeleteStudent(student.studentId)}
                            disabled={isDeleting === student.studentId}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 fill-red-500 hover:fill-red-700"
                          viewBox="0 0 24 24">
                          <path
                            d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                            data-original="#000000" />
                          <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                            data-original="#000000" />
                        </svg>
                      </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='3' className='px-5 py-8 text-center text-gray-500'>
                      {studentsList.length === 0 ? 'No students added yet.' : 'No students match the current filters.'}
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

export default StudentsList
