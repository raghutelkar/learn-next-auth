import Logout from '@/components/Logout'
import { auth } from '@/auth'
import Link from 'next/link'
import AddSessionsForm from '@/components/AddSessionsForm'
import DeleteSessionButton from '@/components/DeleteSessionButton'
import EditSessionButton from '@/components/EditSessionButton'
import fetchUserData from '@/app/api/utils/fetchUserData'
import Image from 'next/image'

import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const HomePage = async () => {
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentMonthName = monthNames[new Date().getMonth()];
  const session = await auth()

  if (!session?.user) redirect('/')

  const data = await fetchUserData(session?.user?.name)
  data.sessions = data.sessions.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  const lastFiveSessions = data.sessions.slice(0, 5);

const totalSessionsInCurrentMonth = data?.sessions.filter(session => {
  const sessionDate = new Date(session.date);
  return sessionDate.getMonth() === new Date().getMonth();
}).length;


  return (
    <div className='flex flex-col'>
      <header className='sticky top-0 z-50 flex-shrink-0 bg-white'>
        <div className='flex flex-wrap items-center px-10 py-4 shadow-md shadow-yellow-400 min-h-[56px] w-full relative tracking-wide'>
          <div className='flex items-center flex-wrap gap-x-8 gap-y-4 z-50 w-full'>
            <Image
              src='/logo.png'
              alt='Sampurnah Yogashraya'
              width={500}
              height={500}
              priority={true}
              className='w-[150px] lg:w-[200px] h-auto'
            />

            <div className='flex items-center gap-8 ml-auto font-medium text-xl'>
              <p>Welcome, {session?.user?.name ?? 'User'}</p>
              <div className='dropdown-menu relative flex shrink-0 group'>
                <img
                  src='https://readymadeui.com/team-1.webp'
                  alt='profile-pic'
                  className='w-12 h-12 rounded-full border-2 border-gray-300 cursor-pointer'
                />

                <div className='dropdown-content hidden group-hover:block shadow-md p-2 bg-white rounded-md absolute top-12 right-0 w-56'>
                  <div className='w-full'>
                    <Logout />
                    {data?.profile?.role === 'admin' && (
                    <>
                    <hr className='my-2 -mx-2 border-gray-200' />
                    <Link href='/admin' className='text-[15px] text-slate-800 font-medium cursor-pointer flex items-center p-2 rounded-md hover:bg-gray-100 dropdown-item transition duration-300 ease-in-out'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='currentColor'
                        className='w-[18px] h-[18px] mr-3 fill-current'
                        viewBox='0 0 24 24'
                      >
                        <path
                          d='M19.56 23.253H4.44a4.051 4.051 0 0 1-4.05-4.05v-9.115c0-1.317.648-2.56 1.728-3.315l7.56-5.292a4.062 4.062 0 0 1 4.644 0l7.56 5.292a4.056 4.056 0 0 1 1.728 3.315v9.115a4.051 4.051 0 0 1-4.05 4.05zM12 2.366a2.45 2.45 0 0 0-1.393.443l-7.56 5.292a2.433 2.433 0 0 0-1.037 1.987v9.115c0 1.34 1.09 2.43 2.43 2.43h15.12c1.34 0 2.43-1.09 2.43-2.43v-9.115c0-.788-.389-1.533-1.037-1.987l-7.56-5.292A2.438 2.438 0 0 0 12 2.377z'
                          data-original='#000000'
                        ></path>
                        <path
                          d='M16.32 23.253H7.68a.816.816 0 0 1-.81-.81v-5.4c0-2.83 2.3-5.13 5.13-5.13s5.13 2.3 5.13 5.13v5.4c0 .443-.367.81-.81.81zm-7.83-1.62h7.02v-4.59c0-1.933-1.577-3.51-3.51-3.51s-3.51 1.577-3.51 3.51z'
                          data-original='#000000'
                        ></path>
                      </svg>
                      Dashboard
                    </Link>
                    </>
        )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

    {session?.user?.name && (
      <div className='container mx-auto'>
        <AddSessionsForm userId={data?.profile?.userId} />
      <div className='container mx-auto py-10 flex justify-center'>
        <div className='pl-4 pr-4 flex flex-col w-full max-h-[calc(100vh-400px)]'>
          <div className='text-lg flex flex-row-reverse font-bold px-5 py-2 text-gray-500 shadow border-b border-gray-300'>
            Total sessions in {currentMonthName} : {totalSessionsInCurrentMonth}
          </div>
          <div className='text-xl font-bold px-5 py-2 bg-slate-700 text-white shadow border-b border-gray-300'>
            Recent sessions
          </div>

          <div
            className='w-full overflow-auto shadow bg-white flex-1'
            id='journal-scroll'
          >
            <table className='w-full'>
              <tbody className=''>
                {lastFiveSessions && lastFiveSessions.map(session => (
                <tr key={session.id}
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
                    <EditSessionButton session={session} />
                    </div>
                    <div className='pt-2'>
                    <DeleteSessionButton sessionId={session?.sessionId} />
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
    )}

      {/* <div className="flex flex-col items-center m-4">
            {session?.user?.name && (
                <>
                    <AddSessionsForm userId={data?.profile?.userId} />
                    <br/>
                    {data?.profile?.role === 'admin' && (
                    <>
                    <p className="my-3">
                        Don't you have an account?
                        <Link href="/register" className="mx-2 underline">Register</Link>
                    </p>
                    <p>
                        adminPage <Link href='/admin' className="mx-2 underline">Go to Admin Page</Link>
                    </p>
                    </>
                    )}
                     <br/>
                    <h2>Your Previous Sessions:</h2>
                    {data?.sessions && <ul>
                        {data?.sessions.map(session => (
                            <li key={session.id} className="border border-black p-2">
                                {new Date(session.date).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} - {new Date(session.start).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' })} to {new Date(session.end).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                                <br/>
                                <br/>
                                Mode: {session.mode} | Type: {session.sessionType} {session.students !== 'N/A' && <>| Students: {session.students}</>}
                                <br/>
                            <EditSessionButton session={session} />
                            <DeleteSessionButton sessionId={session?.sessionId} />
                            </li>
                        ))}
                    </ul>
                    }

                </>
            )}
            <Logout />
        </div> */}
    </div>
  )
}

export default HomePage
