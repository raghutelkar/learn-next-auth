import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'

const LeftBranding = ({ routes, from }) => {
  return (
    <div className='flex flex-col items-center justify-center text-center lg:items-start'>
      <Image
        src='/logo.png'
        alt='Sampurnah Yogashraya'
        width={500}
        height={500}
        priority={true}
        className='w-[150px] lg:w-[200px] h-auto mb-6'
      />

      <motion.h1
        className='lg:text-4xl text-3xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-yellow-500 to-blue-600'
        initial={{ opacity: 0, y: -70 }}   // Start slightly left + invisible
        animate={{ opacity: 1, y: 0 }}     // Move to normal place + visible
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        SampurnahSync
      </motion.h1>
      

      <em className='text-[15px] text-gray-400 leading-relaxed flex lg:text-left'>
        Track your yoga sessions app.
      </em>

      <p className='text-[15px] mt-6 lg:mt-12 text-slate-600'>
        {from === 'register' ? 'Already have an account? ' : 'Don\'\t have an account? '} 
        <Link
          href={routes}
          className='text-blue-600 font-medium hover:underline ml-1'
        >
          {from === 'register' ? 'Login here' : 'Register here'}
        </Link>
      </p>
    </div>
  )
}

export default LeftBranding
