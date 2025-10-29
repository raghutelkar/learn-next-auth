'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react' // Add this import
import { motion } from 'motion/react'

const AddSessionsForm = ({ userId }) => {
  const router = useRouter()
  const [selectedMode, setSelectedMode] = useState('')
  const [selectedSessionType, setSelectedSessionType] = useState('')
  const [selectedOfflineSessionType, setSelectedOfflineSessionType] =
    useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [students, setStudents] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleModeChange = (e) => {
    setSelectedMode(e.target.value)
    setSelectedSessionType('')
    setSelectedOfflineSessionType('')
    setStudents('')
    setSelectedDate('')
    setStartTime('')
    setEndTime('')
    setTimeSlot('')
  }

  // Validate time to only allow 00, 15, 30, 45 minutes
  const validateTime = (timeValue) => {
    if (!timeValue) return timeValue;
    const [hours, minutes] = timeValue.split(':');
    const validMinutes = ['00', '15', '30', '45'];
    if (!validMinutes.includes(minutes)) {
      // Round to nearest valid minute
      const minuteNum = parseInt(minutes);
      let roundedMinute;
      if (minuteNum < 8) roundedMinute = '00';
      else if (minuteNum < 23) roundedMinute = '15';
      else if (minuteNum < 38) roundedMinute = '30';
      else if (minuteNum < 53) roundedMinute = '45';
      else roundedMinute = '00';
      return `${hours}:${roundedMinute}`;
    }
    return timeValue;
  };

  // Calculate the date range
  const today = new Date()
  const fiveDaysAgo = new Date(today)
  fiveDaysAgo.setDate(today.getDate() - 5)

  // Format dates to YYYY-MM-DD for the input attributes
  const maxDate = today.toISOString().split('T')[0]
  const minDate = fiveDaysAgo.toISOString().split('T')[0]

  const timeSlots = [
    { label: '6:00 AM - 7:00 AM', start: '06:00', end: '07:00' },
    { label: '7:00 AM - 8:00 AM', start: '07:00', end: '08:00' },
    { label: '8:00 AM - 9:00 AM', start: '08:00', end: '09:00' },
    { label: '5:00 PM - 6:00 PM', start: '17:00', end: '18:00' },
    { label: '6:00 PM - 7:00 PM', start: '18:00', end: '19:00' },
    { label: '7:00 PM - 8:00 PM', start: '19:00', end: '20:00' },
  ]

  // Check if all required fields are filled
  const isFormValid = () => {
    // Mode must be selected
    if (!selectedMode) return false

    // Date must be selected
    if (!selectedDate) return false

    // Session type must be selected
    if (selectedMode === 'online') {
      if (!selectedSessionType) return false

      // If online personal or prenatal, student must be selected
      if (
        (selectedSessionType === 'onlinepersonal' ||
          selectedSessionType === 'onlineprenatal') &&
        !students
      ) {
        return false
      }

      // Time must be selected and different
      if (!startTime || !endTime) return false
      if (startTime === endTime) return false
    } else if (selectedMode === 'offline') {
      if (!selectedOfflineSessionType) return false

      // If offline personal, student must be selected
      if (selectedOfflineSessionType === 'offlinepersonal' && !students) {
        return false
      }

      // Time validation based on session type
      if (selectedOfflineSessionType === 'offlinegeneral') {
        if (!timeSlot) return false
      } else {
        if (!startTime || !endTime) return false
        if (startTime === endTime) return false
      }
    }

    return true
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)

      const selectedDate = formData.get('date')
      let startTime, endTime

      if (
        selectedMode === 'online' ||
        (selectedMode === 'offline' &&
          selectedOfflineSessionType !== 'offlinegeneral')
      ) {
        startTime = formData.get('startTime')
        endTime = formData.get('endTime')

        if (!startTime || !endTime) {
          alert('Please select both start and end times')
          setIsSubmitting(false)
          return
        }
      } else {
        const selectedTimeSlot = formData.get('timeSlot')

        if (!selectedTimeSlot) {
          alert('Please select a time slot')
          setIsSubmitting(false)
          return
        }

        ;[startTime, endTime] = selectedTimeSlot.split(',')
      }

      const startDateTime = new Date(`${selectedDate}T${startTime}:00`)
      const endDateTime = new Date(`${selectedDate}T${endTime}:00`)

      const response = await fetch(`/api/addSession`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        cache: 'no-cache',
        body: JSON.stringify({
          userId,
          sessionId: 's_' + Date.now(),
          mode: selectedMode,
          sessionType:
            selectedMode === 'online'
              ? selectedSessionType
              : selectedOfflineSessionType,
          students: formData.get('students'),
          date: new Date(selectedDate).toISOString(),
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
        }),
      })

      if (response.status === 201) {
        // Show success message
        setShowSuccess(true)
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false)
        }, 2000)
        
        // Reset form
        setSelectedMode('')
        setSelectedSessionType('')
        setSelectedOfflineSessionType('')
        setSelectedDate('')
        setStartTime('')
        setEndTime('')
        setTimeSlot('')
        setStudents('')
        setIsSubmitting(false)
        
        // Force revalidation of all cached data
        router.refresh()
        await new Promise((resolve) => setTimeout(resolve, 100)) // Small delay to ensure refresh
        router.push('/profile')
      } else {
        setIsSubmitting(false)
      }
    } catch (e) {
      console.error('Error submitting form:', e.message)
      alert('Error submitting session. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className='mt-6 mb-6'>
      <div className='mx-auto shadow-xl p-6 bg-white rounded-sm'>
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
                  <ellipse cx="256" cy="256" fill="#fff" data-original="#fff" rx="256" ry="255.832" />
                  <path className="fill-green-600"
                    d="m235.472 392.08-121.04-94.296 34.416-44.168 74.328 57.904 122.672-177.016 46.032 31.888z"
                    data-original="#ffffff" />
                </svg>
              </div>
              <span className="text-[15px] mr-3">Registered successfully</span>
            </div>
          </motion.div>
        )}
        <h2 className='text-xl text-slate-800 font-semibold'>
          Register your sessions
        </h2>
        <form
          onSubmit={handleSubmit}
          className='my-5 flex flex-col items-start'
        >
          <div className='flex items-start justify-start mb-4'>
            <div className='mx-auto'>
              <div className='mx-auto'>
                <div className='flex gap-4'>
                  <div className='relative'>
                    <input
                      type='radio'
                      name='mode'
                      id='mode-online'
                      value='online'
                      checked={selectedMode === 'online'}
                      onChange={handleModeChange}
                      className='hidden peer'
                    />
                    <label
                      htmlFor='mode-online'
                      className='inline-flex items-center justify-between w-full p-3.5 bg-white border-2 rounded-lg cursor-pointer group border-neutral-200/70 text-neutral-600 peer-checked:border-blue-400 peer-checked:text-neutral-900 peer-checked:bg-blue-200/50 hover:text-neutral-900 hover:border-green-500'
                    >
                      <div className='flex items-center space-x-5'>
                        <svg
                          className='w-10 h-auto'
                          xmlns='http://www.w3.org/2000/svg'
                          width='1em'
                          height='1em'
                          viewBox='0 0 256 256'
                        >
                          <g fill='green'>
                            <path
                              d='M232 64v128a8 8 0 0 1-8 8H32a8 8 0 0 1-8-8V64a8 8 0 0 1 8-8h192a8 8 0 0 1 8 8'
                              opacity='0.2'
                            />
                            <path d='M251.77 73a8 8 0 0 0-8.21.39L208 97.05V72a16 16 0 0 0-16-16H32a16 16 0 0 0-16 16v112a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16v-25.05l35.56 23.66A8 8 0 0 0 256 176V80a8 8 0 0 0-4.23-7M192 184H32V72h160v112m48-22.95l-32-21.33v-23.44l32-21.33Z' />
                          </g>
                        </svg>
                        <div className='flex flex-col justify-start'>
                          <div className='w-full text-lg font-semibold'>Online</div>
                        </div>
                      </div>
                    </label>
                  </div>
                  <div className='relative'>
                    <input
                      type='radio'
                      name='mode'
                      id='mode-offline'
                      value='offline'
                      checked={selectedMode === 'offline'}
                      onChange={handleModeChange}
                      className='hidden peer'
                    />
                    <label
                      htmlFor='mode-offline'
                      className='inline-flex items-center justify-between w-full p-3.5 bg-white border-2 rounded-lg cursor-pointer group border-neutral-200/70 text-neutral-600 peer-checked:border-blue-400 peer-checked:text-neutral-900 peer-checked:bg-blue-200/50 hover:text-neutral-900 hover:border-green-500'
                    >
                      <div className='flex items-center space-x-5'>
                        <svg
                          className='w-10 h-auto'
                          xmlns='http://www.w3.org/2000/svg'
                          width='1em'
                          height='1em'
                          viewBox='0 0 256 256'
                        >
                          <g fill='green'>
                            <path
                              d='M128 24a80 80 0 0 0-80 80c0 72 80 128 80 128s80-56 80-128a80 80 0 0 0-80-80m0 112a32 32 0 1 1 32-32a32 32 0 0 1-32 32'
                              opacity='0.2'
                            />
                            <path d='M128 16a88.1 88.1 0 0 0-88 88c0 75.3 80 132.17 83.41 134.55a8 8 0 0 0 9.18 0C136 236.17 216 179.3 216 104a88.1 88.1 0 0 0-88-88m0 206c-16.53-13-72-60.75-72-118a72 72 0 0 1 144 0c0 57.23-55.47 105-72 118m0-150a40 40 0 1 0 40 40a40 40 0 0 0-40-40m0 64a24 24 0 1 1 24-24a24 24 0 0 1-24 24' />
                          </g>
                        </svg>
                        <div className='flex flex-col justify-start'>
                          <div className='w-full text-lg font-semibold'>
                            Offline
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {selectedMode === 'offline' && (
            <div className='my-2 w-full'>
              <label
                htmlFor='offlineSessions'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Classes
              </label>
              <select
                className='border border-gray-500 rounded p-2 w-full bg-white outline-none text-slate-500'
                name='sessionType'
                id='offlineSessions'
                value={selectedOfflineSessionType}
                onChange={(e) => {
                  setSelectedOfflineSessionType(e.target.value)
                  setStudents('')
                }}
              >
                <option value=''>Please select a class</option>
                <option value='offlinegeneral'>General</option>
                <option value='offlinepersonal'>Personal</option>
                <option value='offlineprenatal'>Semi-Prenatal</option>
                <option value='offlinesemiprivate'>Semi-Private</option>
                <option value='offlinekids'>Kids</option>
                <option value='offlineteens'>Teens</option>
                <option value='offlineseniors'>Seniors Citizen</option>
              </select>
            </div>
          )}
          {selectedMode === 'offline' &&
            selectedOfflineSessionType === 'offlinepersonal' && (
              <div className='my-2 w-full'>
                <label htmlFor='personalStudents'>
                  Personal Session Students
                </label>
                <select
                  className='border border-gray-500 rounded p-2 w-full bg-white outline-none text-slate-500'
                  name='students'
                  id='personalStudents'
                  value={students}
                  onChange={(e) => setStudents(e.target.value)}
                >
                  <option value=''>Please select</option>
                  <option value='Raj'>Raj</option>
                  <option value='Ravi'>Ravi</option>
                  <option value='Simran'>Simran</option>
                  <option value='Aisha'>Aisha</option>
                  <option value='Rahul'>Rahul</option>
                </select>
              </div>
            )}

          {selectedMode === 'online' && (
            <div className='my-2 w-full'>
              <label
                htmlFor='onlineSessions'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Classes
              </label>
              <select
                className='border border-gray-500 rounded p-2 w-full bg-white outline-none text-slate-500'
                name='sessionType'
                id='onlineSessions'
                value={selectedSessionType}
                onChange={(e) => {
                  setSelectedSessionType(e.target.value)
                  setStudents('')
                }}
              >
                <option value=''>Please select a class</option>
                <option value='onlinepersonal'>Personal</option>
                <option value='onlineprenatal'>Prenatal</option>
              </select>
            </div>
          )}
          {selectedSessionType === 'onlinepersonal' && (
            <div className='my-2 w-full'>
              <label
                htmlFor='personalStudents'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Personal Session Students
              </label>
              <select
                className='border border-gray-500 rounded p-2 w-full bg-white outline-none text-slate-500'
                name='students'
                id='personalStudents'
                value={students}
                onChange={(e) => setStudents(e.target.value)}
              >
                <option value=''>Please select</option>
                <option value='Kiran'>Kiran</option>
                <option value='Kusha'>Kusha</option>
                <option value='Romio'>Romio</option>
                <option value='Riya'>Riya</option>
                <option value='Gops'>Gops</option>
              </select>
            </div>
          )}

          {selectedSessionType === 'onlineprenatal' && (
            <div className='my-2 w-full'>
              <label
                htmlFor='prenatalStudents'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Prenatal Session Students
              </label>
              <select
                className='border border-gray-500 rounded p-2 w-full bg-white outline-none text-slate-500'
                name='students'
                id='prenatalStudents'
                value={students}
                onChange={(e) => setStudents(e.target.value)}
              >
                <option value=''>Please select</option>
                <option value='Ammu'>Ammu</option>
                <option value='Bina'>Bina</option>
                <option value='Chhaya'>Chhaya</option>
                <option value='Dipa'>Dipa</option>
                <option value='Esha'>Esha</option>
              </select>
            </div>
          )}

          {(selectedMode === 'online' || selectedMode === 'offline') && (
            <div className='my-2 w-full'>
              <label
                htmlFor='date'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Select Date
              </label>
              <input
                className='border border-gray-500 rounded py-1 w-full outline-none text-slate-500 bg-white'
                type='date'
                name='date'
                id='date'
                min={minDate}
                max={maxDate}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>
          )}

          {selectedMode === 'online' ||
          (selectedMode === 'offline' &&
            selectedOfflineSessionType !== 'offlinegeneral') ? (
            <div className='my-2 w-full'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='startTime'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Start Time
                  </label>
                  <input
                    type='time'
                    id='startTime'
                    name='startTime'
                    min='05:00'
                    max='19:00'
                    step='900'
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    onBlur={(e) => setStartTime(validateTime(e.target.value))}
                    className='border border-gray-500 rounded py-1 w-full bg-white outline-none text-slate-500'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='endTime'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    End Time
                  </label>
                  <input
                    type='time'
                    id='endTime'
                    name='endTime'
                    min='05:00'
                    max='19:00'
                    step='900'
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    onBlur={(e) => setEndTime(validateTime(e.target.value))}
                    className='border border-gray-500 rounded py-1 w-full bg-white outline-none text-slate-500'
                    required
                  />
                </div>
              </div>
            </div>
          ) : (
            selectedMode === 'offline' &&
            selectedOfflineSessionType === 'offlinegeneral' && (
              <div className='my-2 w-full'>
                <label
                  htmlFor='timeSlot'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Select Time Slot
                </label>
                <select
                  className='border border-gray-500 rounded p-2 w-full bg-white outline-none text-slate-500'
                  name='timeSlot'
                  id='timeSlot'
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  required
                >
                  <option value=''>Select a time slot</option>
                  {timeSlots.map((slot, index) => (
                    <option key={index} value={`${slot.start},${slot.end}`}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </div>
            )
          )}

          {(selectedMode === 'online' || selectedMode === 'offline') && (
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
                  Registering...
                </>
              ) : (
                'Register Session'
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

export default AddSessionsForm
