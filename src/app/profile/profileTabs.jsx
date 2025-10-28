"use client"
import { useState } from 'react';
import DeleteSessionButton from '@/components/DeleteSessionButton'
import EditSessionButton from '@/components/EditSessionButton'
import AddSessionsForm from '@/components/AddSessionsForm'

const ProfileTabs = ({currentMonthName, lastFiveSessions, totalSessionsInCurrentMonth, data}) => {
  const [activeTab, setActiveTab] = useState('addSessions');

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div>
      <ul className="flex bg-gray-100 items-center rounded-md overflow-hidden">
        <li
          id="addSessionsTab"
          onClick={() => handleTabClick('addSessions')}
          className={`tab font-semibold tracking-wide h-[50px] items-center w-full text-center text-base py-3 px-6 cursor-pointer ${
            activeTab === 'addSessions'
              ? 'text-white bg-gradient-to-l from-yellow-300 via-white-400 to-green-400'
              : 'text-slate-600 font-medium'
          }`}
        >
          Add Sessions
        </li>
        <li
          id="recentSessionsTab"
          onClick={() => handleTabClick('recentSessions')}
          className={`tab font-semibold tracking-wide h-[50px] items-center w-full text-center text-base py-3 px-6 cursor-pointer ${
            activeTab === 'recentSessions'
              ? 'text-white bg-gradient-to-l from-green-400 via-white-400 to-yellow-300'
              : 'text-slate-600 font-medium'
          }`}
        >
          Recent Sessions
        </li>
      </ul>

      <div
        id="addSessionsContent"
        className={`tab-content mt-6 ${activeTab === 'addSessions' ? 'block' : 'hidden'}`}
      >
        <div>
            <AddSessionsForm userId={data?.profile?.userId} />
    </div>
      </div>

      <div
        id="recentSessionsContent"
        className={`tab-content mt-8 ${activeTab === 'recentSessions' ? 'block' : 'hidden'}`}
      >
    <div className='container mx-auto flex justify-center'>
        <div className='flex flex-col w-full max-h-[calc(100vh-300px)]'>
          <div className='text-lg flex flex-row-reverse font-bold px-5 py-2 text-gray-500'>
            Total sessions in {currentMonthName} : {totalSessionsInCurrentMonth}
          </div>
          <div className='text-xl font-bold px-5 py-2 bg-slate-700 text-white shadow border-b border-gray-300'>
            Your recent sessions
          </div>

          <div
            className='w-full overflow-auto shadow-xl bg-white flex-1'
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
    </div>
  );
};

export default ProfileTabs;