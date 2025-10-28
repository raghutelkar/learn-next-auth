import { doLogout } from '@/app/actions'

const Logout = () => {
  return (
    <form action={doLogout}>
      <button type='submit'
        className='text-[15px] text-slate-800 font-medium cursor-pointer flex items-center p-2 w-full rounded-md hover:bg-gray-100 dropdown-item transition duration-300 ease-in-out'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-[18px] h-[18px] mr-3 fill-current'
          viewBox='0 0 6 6'
        >
          <path
            d='M3.172.53a.265.266 0 0 0-.262.268v2.127a.265.266 0 0 0 .53 0V.798A.265.266 0 0 0 3.172.53zm1.544.532a.265.266 0 0 0-.026 0 .265.266 0 0 0-.147.47c.459.391.749.973.749 1.626 0 1.18-.944 2.131-2.116 2.131A2.12 2.12 0 0 1 1.06 3.16c0-.65.286-1.228.74-1.62a.265.266 0 1 0-.344-.404A2.667 2.667 0 0 0 .53 3.158a2.66 2.66 0 0 0 2.647 2.663 2.657 2.657 0 0 0 2.645-2.663c0-.812-.363-1.542-.936-2.03a.265.266 0 0 0-.17-.066z'
            data-original='#000000'
          />
        </svg>
        Logout
      </button>
    </form>
  )
}

export default Logout
