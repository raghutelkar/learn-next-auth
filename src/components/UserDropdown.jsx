import Link from 'next/link'
import Logout from '@/components/Logout'

const PROFILE_IMAGE = 'https://readymadeui.com/team-1.webp'

const DashboardIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='currentColor'
    className='w-[18px] h-[18px] mr-3'
    viewBox='0 0 24 24'
    aria-hidden='true'
  >
    <path d='M19.56 23.253H4.44a4.051 4.051 0 0 1-4.05-4.05v-9.115c0-1.317.648-2.56 1.728-3.315l7.56-5.292a4.062 4.062 0 0 1 4.644 0l7.56 5.292a4.056 4.056 0 0 1 1.728 3.315v9.115a4.051 4.051 0 0 1-4.05 4.05zM12 2.366a2.45 2.45 0 0 0-1.393.443l-7.56 5.292a2.433 2.433 0 0 0-1.037 1.987v9.115c0 1.34 1.09 2.43 2.43 2.43h15.12c1.34 0 2.43-1.09 2.43-2.43v-9.115c0-.788-.389-1.533-1.037-1.987l-7.56-5.292A2.438 2.438 0 0 0 12 2.377z' />
    <path d='M16.32 23.253H7.68a.816.816 0 0 1-.81-.81v-5.4c0-2.83 2.3-5.13 5.13-5.13s5.13 2.3 5.13 5.13v5.4c0 .443-.367.81-.81.81zm-7.83-1.62h7.02v-4.59c0-1.933-1.577-3.51-3.51-3.51s-3.51 1.577-3.51 3.51z' />
  </svg>
)

/**
 * User dropdown menu component
 */
const UserDropdown = ({ userRole }) => {
  const isAdmin = userRole === 'admin'

  return (
    <div className='dropdown-menu relative flex shrink-0 group'>
      <button
        className='focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-full'
        aria-label='User menu'
        aria-haspopup='true'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'
          className='w-14 h-14 text-yellow-500 cursor-pointer transition-transform hover:scale-105 hover:text-yellow-600 p-2'
          aria-label='User profile'
        >
          <path
            fillRule='evenodd'
            d='M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z'
            clipRule='evenodd'
          />
        </svg>
      </button>

      <div
        className='dropdown-content hidden group-hover:block shadow-lg p-2 bg-white rounded-md absolute top-14 right-0 w-56 border border-gray-100'
        role='menu'
        aria-label='User menu options'
      >
        <Logout />
        
        {isAdmin && (
          <>
            <hr className='my-2 -mx-2 border-gray-200' />
            <Link
              href='/admin'
              className='text-[15px] text-slate-800 font-medium cursor-pointer flex items-center p-2 rounded-md hover:bg-gray-100 transition duration-300 ease-in-out'
              role='menuitem'
            >
              <DashboardIcon />
              Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default UserDropdown