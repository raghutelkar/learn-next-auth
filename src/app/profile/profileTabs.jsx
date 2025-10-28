"use client"
import { useState } from 'react';
import AddSessionsForm from '@/components/AddSessionsForm'
import RecentSessions from '@/components/RecentSessions'

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
        <RecentSessions currentMonthName={currentMonthName} totalSessionsInCurrentMonth={totalSessionsInCurrentMonth} lastFiveSessions={lastFiveSessions}/>
      </div>
    </div>
  );
};

export default ProfileTabs;