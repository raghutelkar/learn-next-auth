'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

// Constants
const ROUTES = {
  PROFILE: '/profile',
  REGISTER: '/register',
}

const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  GENERIC: 'An error occurred. Please try again.',
}

const INPUT_STYLES = 'bg-slate-100 w-full text-sm text-slate-900 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-blue-600 focus:bg-transparent transition-colors'
const LABEL_STYLES = 'text-sm text-slate-900 font-medium mb-2 block'

const LoginForm = () => {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
    <div className='lg:min-h-screen flex flex-col items-center justify-center p-6'>
      <div className='grid lg:grid-cols-2 items-center gap-10 max-w-6xl max-lg:max-w-lg w-full'>
        {/* Left Column - Branding */}
        <div>
            <Image
              src='/logo.png'
              alt='Sampurnah Yogashraya'
              width={500}
              height={500}
              priority={true}
              className='w-[250px] lg:w-[300px] h-auto mb-10'
            />

          <h1 className='lg:text-4xl text-3xl font-bold text-green-900 leading-tight'>
            SampurnahSync
          </h1>

          <p className='text-[15px] mt-6 text-slate-600 leading-relaxed'>
            Track yoga sessions, monitor teacher contributions, and streamline
            studio management — all in one place.
          </p>

          <p className='text-[15px] mt-6 lg:mt-12 text-slate-600'>
            Don&apos;t have an account?{' '}
            <Link
              href={ROUTES.REGISTER}
              className='text-blue-600 font-medium hover:underline ml-1'
            >
              Register here
            </Link>
          </p>
        </div>

        {/* Right Column - Login Form */}
        <form 
          className='max-w-md lg:ml-auto w-full' 
          onSubmit={onSubmit}
          noValidate
        >
          <h2 className='text-slate-700 text-2xl font-semibold mb-8'>
            Hey, time to Log In
          </h2>

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
                autoComplete='email'
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
              <input
                name='password'
                type='password'
                id='password'
                required
                autoComplete='current-password'
                disabled={isLoading}
                className={INPUT_STYLES}
                placeholder='Enter Password'
                aria-label='Password'
              />
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

          {/* Error Message */}
          {error && (
            <div 
              className='text-center text-red-500 pt-6 text-sm font-medium'
              role='alert'
              aria-live='polite'
            >
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default LoginForm