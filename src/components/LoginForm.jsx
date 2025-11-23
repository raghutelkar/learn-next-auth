'use client'

import { motion } from 'motion/react'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import LeftBranding from '@/components/LeftBranding'

const ROUTES = {
  PROFILE: '/profile',
  REGISTER: '/register',
}

const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  GENERIC: 'An error occurred. Please try again.',
}

const INPUT_STYLES =
  'bg-slate-100 w-full text-base text-slate-900 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-blue-600 focus:bg-transparent transition-colors'
const LABEL_STYLES = 'text-sm text-slate-900 font-medium mb-2 block'

const LoginForm = () => {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const onSubmit = useCallback(
    async (event) => {
      event.preventDefault()
      setError('')
      setIsLoading(true)

      try {
        const formData = new FormData(event.currentTarget)
        const email = formData.get('email')?.toString() || ''
        const password = formData.get('password')?.toString() || ''

        if (!email || !password) {
          setError('Please fill in all fields')
          return
        }

        const response = await signIn('credentials', {
          redirect: false,
          email,
          password,
        })

        if (response?.error) {
          setError(ERROR_MESSAGES.INVALID_CREDENTIALS)
        } else if (response?.ok) {
          router.push(ROUTES.PROFILE)
        }
      } catch (e) {
        setError(ERROR_MESSAGES.GENERIC)
      } finally {
        setIsLoading(false)
      }
    },
    [router]
  )

  return (
    <div className='lg:min-h-screen flex flex-col items-center justify-center p-6 border-yellow-400 border-t-8'>
      <div className='grid lg:grid-cols-2 items-center gap-10 max-w-6xl max-lg:max-w-lg w-full'>
        {/* Left Column - Branding */}
        <LeftBranding routes={ROUTES.REGISTER} from='login' />
        
        {/* Right Column - Login Form */}
        <form
          autoComplete='off'
          className='max-w-md lg:ml-auto w-full'
          onSubmit={onSubmit}
          noValidate
        >
          <motion.h2
            className='text-green-700 text-2xl font-semibold mb-8'
          >
            Hey, time to Log In
          </motion.h2>

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

          <div className='space-y-6'>
            {/* Email Field */}
            <div>
              <label className={LABEL_STYLES} htmlFor='email'>
                Email Address
              </label>
              <input
                name='email'
                type='email'
                id='email'
                required
                autoComplete='off'
                disabled={isLoading}
                className={INPUT_STYLES}
                placeholder='Enter Email'
                aria-label='Email Address'
              />
            </div>

            {/* Password Field */}
            <div>
              <label className={LABEL_STYLES} htmlFor='password'>
                Password
              </label>
              <div className='relative'>
                <input
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  required
                  autoComplete='off'
                  disabled={isLoading}
                  className={INPUT_STYLES + ' pr-12'}
                  placeholder='Enter Password'
                  aria-label='Password'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword((prev) => !prev)}
                  className='absolute inset-y-0 right-3 flex items-center text-slate-600 hover:text-slate-900 focus:outline-none'
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    // Eye off icon
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                      <path d='M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.06-6.94M9.88 9.88a3 3 0 0 0 4.24 4.24' />
                      <path d='M1 1l22 22' />
                      <path d='M6.1 2.1A11 11 0 0 1 12 4c7 0 11 8 11 8a21.82 21.82 0 0 1-2.72 3.94' />
                      <path d='M12 12a3 3 0 0 1 3-3' />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                      <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z' />
                      <circle cx='12' cy='12' r='3' />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className='mt-12'>
            <button
              type='submit'
              disabled={isLoading}
              className='w-full shadow-xl py-2.5 px-4 text-[15px] font-medium rounded-md text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
              aria-label='Log in to your account'
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
