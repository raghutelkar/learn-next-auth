'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'motion/react'

const AddStudentsForm = () => {
  const router = useRouter()
  const [selectedMode, setSelectedMode] = useState('')
  const [selectedSessionType, setSelectedSessionType] = useState('')
  const [studentName, setStudentName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleModeChange = (e) => {
    const mode = e.target.value
    setSelectedMode(mode)
    setSelectedSessionType('')
    setStudentName('')
  }

  const isFormValid = () => {
    return selectedMode && selectedSessionType && studentName.trim()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)

      const response = await fetch(`/api/addStudent`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        cache: 'no-cache',
        body: JSON.stringify({
          mode: selectedMode,
          studentId: 's_' + Date.now(),
          studentName: formData.get('studentName').trim(),
          sessionType: selectedSessionType,
        }),
      })

      if (response.status === 201) {
        setShowSuccess(true)
        
        setTimeout(() => {
          setShowSuccess(false)
        }, 2000)
        
        // Reset form
        setSelectedMode('')
        setSelectedSessionType('')
        setStudentName('')
        
        router.refresh()
        await new Promise((resolve) => setTimeout(resolve, 100))
        router.push('/add-students')
      } else if (response.status === 409) {
        const errorMessage = await response.text()
        setError(errorMessage)
        setTimeout(() => setError(''), 5000)
      } else {
        setError('Failed to add student. Please try again.')
        setTimeout(() => setError(''), 5000)
      }
    } catch (e) {
      console.error('Error submitting form:', e.message)
      setError('Error adding student. Please try again.')
      setTimeout(() => setError(''), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const ModeRadioButton = ({ id, value, label, icon }) => (
    <div className='relative'>
      <input
        type='radio'
        name='mode'
        id={id}
        value={value}
        checked={selectedMode === value}
        onChange={handleModeChange}
        className='hidden peer'
      />
      <label
        htmlFor={id}
        className='inline-flex items-center justify-between w-full p-3.5 bg-white border-2 rounded-lg cursor-pointer group border-neutral-200/70 text-neutral-600 peer-checked:border-blue-400 peer-checked:text-neutral-900 peer-checked:bg-blue-200/50 hover:text-neutral-900 hover:border-green-500'
      >
        <div className='flex items-center space-x-5'>
          {icon}
          <div className='text-lg font-semibold'>{label}</div>
        </div>
      </label>
    </div>
  )

  const sessionTypes = {
    online: [
      { value: 'onlinepersonal', label: 'Personal' },
      { value: 'onlineprenatal', label: 'Prenatal' },
    ],
    offline: [
      { value: 'offlinepersonal', label: 'Personal' },
      { value: 'offlineprenatal', label: 'Prenatal' },
    ],
  }

  return (
    <div className='container mx-auto mt-8 px-6'>
      <div className='text-xl font-bold px-6 py-4 bg-gradient-to-r from-slate-600 to-slate-800 rounded-t-lg text-white shadow border-b border-gray-300'>
        Add Students
      </div>
      <div className='mx-auto shadow-xl p-6 bg-white rounded-sm'>
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
        {showSuccess && (
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
              <span className="text-[15px] mr-3">Student added successfully</span>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className='my-5 flex flex-col items-start'>
          {/* Mode Selection */}
          <div className='flex items-start justify-start mb-4 w-full'>
            <div className='mx-auto'>
              <div className='flex gap-4'>
                <ModeRadioButton
                  id='mode-online'
                  value='online'
                  label='Online'
                  icon={
                    <svg className='w-5 lg:w-10 h-auto' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'>
                      <g fill='green'>
                        <path d='M232 64v128a8 8 0 0 1-8 8H32a8 8 0 0 1-8-8V64a8 8 0 0 1 8-8h192a8 8 0 0 1 8 8' opacity='0.2' />
                        <path d='M251.77 73a8 8 0 0 0-8.21.39L208 97.05V72a16 16 0 0 0-16-16H32a16 16 0 0 0-16 16v112a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16v-25.05l35.56 23.66A8 8 0 0 0 256 176V80a8 8 0 0 0-4.23-7M192 184H32V72h160v112m48-22.95l-32-21.33v-23.44l32-21.33Z' />
                      </g>
                    </svg>
                  }
                />
                <ModeRadioButton
                  id='mode-offline'
                  value='offline'
                  label='Offline'
                  icon={
                    <svg className='w-5 lg:w-10 h-auto' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'>
                      <g fill='green'>
                        <path d='M128 24a80 80 0 0 0-80 80c0 72 80 128 80 128s80-56 80-128a80 80 0 0 0-80-80m0 112a32 32 0 1 1 32-32a32 32 0 0 1-32 32' opacity='0.2' />
                        <path d='M128 16a88.1 88.1 0 0 0-88 88c0 75.3 80 132.17 83.41 134.55a8 8 0 0 0 9.18 0C136 236.17 216 179.3 216 104a88.1 88.1 0 0 0-88-88m0 206c-16.53-13-72-60.75-72-118a72 72 0 0 1 144 0c0 57.23-55.47 105-72 118m0-150a40 40 0 1 0 40 40a40 40 0 0 0-40-40m0 64a24 24 0 1 1 24-24a24 24 0 0 1-24 24' />
                      </g>
                    </svg>
                  }
                />
              </div>
            </div>
          </div>

          {/* Student Name Input */}
          {selectedMode && (
            <div className='my-2 w-full'>
              <label htmlFor='studentName' className='block text-sm font-medium text-gray-700 mb-1'>
                Student Name
              </label>
              <input
                type='text'
                id='studentName'
                name='studentName'
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className='border border-gray-500 rounded p-2 w-full bg-white outline-none text-slate-500'
                placeholder='Enter student name'
              />
            </div>
          )}

          {/* Session Type Selection */}
          {selectedMode && (
            <div className='my-2 w-full'>
              <label htmlFor='sessionType' className='block text-sm font-medium text-gray-700 mb-1'>
                Session Type
              </label>
              <select
                className='border border-gray-500 rounded p-2 w-full bg-white outline-none text-slate-500'
                name='sessionType'
                id='sessionType'
                value={selectedSessionType}
                onChange={(e) => setSelectedSessionType(e.target.value)}
              >
                <option value=''>Please select a class</option>
                {sessionTypes[selectedMode]?.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Submit Button */}
          {selectedMode && (
            <button
              type='submit'
              disabled={!isFormValid() || isSubmitting}
              className={`mt-4 rounded flex justify-center items-center w-full p-2 transition-colors ${
                isFormValid() && !isSubmitting
                  ? 'text-white bg-gradient-to-l from-yellow-300 via-white-400 to-yellow-600 transition-all duration-300 ease-in-out hover:saturate-200 hover:scale-100 hover:shadow-lg'
                  : isSubmitting
                  ? 'bg-yellow-400 text-gray-800 cursor-wait'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800'
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
                  Adding Student...
                </>
              ) : (
                'Add Student'
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

export default AddStudentsForm