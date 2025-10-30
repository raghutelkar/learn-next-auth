import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import fetchUserData from '@/app/api/utils/fetchUserData'
import ProfileTabs from './profileTabs.jsx'
import Header from '@/components/Header.jsx'
import { getSessionStats } from '@/app/utils/getSessionStats.js'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Constants
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const ProfilePage = async () => {
  // Early return for unauthenticated users
  const session = await auth()
  if (!session?.user) redirect('/')

  // Fetch user data
  const data = await fetchUserData(session.user.name)
  
  // Calculate current month once
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentMonthName = MONTH_NAMES[currentMonth]

  // Get session statistics
  const { sortedSessions, totalSessionsInCurrentMonth } = getSessionStats(
    data.sessions,
    currentMonth
  )

  return (
    <div className='flex flex-col min-h-screen'>
      <Header 
        userName={session.user.name} 
        userRole={data?.profile?.role}
      />
      
      <main className='container mx-auto mt-10 p-4 flex-1'>
        <ProfileTabs
          currentMonthName={currentMonthName}
          sortedSessions={sortedSessions}
          totalSessionsInCurrentMonth={totalSessionsInCurrentMonth}
          data={data}
        />
      </main>
    </div>
  )
}

export default ProfilePage