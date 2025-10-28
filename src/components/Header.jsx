import Image from 'next/image'
import UserDropdown from '@/components/UserDropdown'

/**
 * Header component for profile page
 */
const Header = ({ userName, userRole }) => {
  return (
    <header className='sticky top-0 z-50 flex-shrink-0 bg-white'>
      <div className='flex flex-wrap items-center px-10 py-4 shadow-md shadow-yellow-400 min-h-[56px] w-full relative tracking-wide'>
        <div className='flex items-center flex-wrap gap-x-8 gap-y-4 z-50 w-full'>
          <Image
            src='/logo.png'
            alt='Sampurnah Yogashraya'
            width={200}
            height={200}
            priority={true}
            sizes='(max-width: 1024px) 150px, 200px'
            className='w-[150px] lg:w-[200px] h-auto'
          />

          <div className='flex items-center gap-8 ml-auto font-medium text-xl'>
            <p className='text-gray-800'>
              Welcome, <span className='font-semibold'>{userName ?? 'User'}</span>
            </p>
            
            <UserDropdown userRole={userRole} />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header