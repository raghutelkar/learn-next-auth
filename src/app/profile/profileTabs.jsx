"use client"
import { useState } from 'react';
import AddSessionsForm from '@/components/AddSessionsForm'
import RecentSessions from '@/components/RecentSessions'
import TotalSummary from '@/components/TotalSummary'

const ProfileTabs = ({currentMonthName, sortedSessions, totalSessionsInCurrentMonth, data}) => {
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
          className={`tab font-semibold tracking-wide h-[60px] items-center w-full text-center text-base py-1.5 px-6 cursor-pointer ${
            activeTab === 'addSessions'
              ? 'text-white bg-gradient-to-l from-yellow-300 via-white-400 to-green-400'
              : 'text-slate-600 font-medium'
          }`}
        >
          Add<br/>Sessions
        </li>
        <li
          id="recentSessionsTab"
          onClick={() => handleTabClick('recentSessions')}
          className={`tab font-semibold tracking-wide h-[60px] border-l border-r border-yellow-400 items-center w-full text-center text-base py-1.5 px-6 cursor-pointer ${
            activeTab === 'recentSessions'
              ? 'text-white bg-gradient-to-l from-yellow-300 via-green-400 to-yellow-300'
              : 'text-slate-600 font-medium'
          }`}
        >
          Recent<br/>Sessions
        </li>
        <li
          id="summaryTab"
          onClick={() => handleTabClick('summary')}
          className={`tab font-semibold tracking-wide h-[60px] items-center w-full text-center text-base py-1.5 px-6 cursor-pointer ${
            activeTab === 'summary'
              ? 'text-white bg-gradient-to-l from-green-400 via-white-400 to-yellow-300'
              : 'text-slate-600 font-medium'
          }`}
        >
          Sessions<br/>Summary
        </li>
      </ul>

      <div
        id="addSessionsContent"
        className={`tab-content mt-6 ${activeTab === 'addSessions' ? 'block' : 'hidden'}`}
      >
            <AddSessionsForm userId={data?.profile?.userId} />
      </div>

      <div
        id="recentSessionsContent"
        className={`tab-content mt-8 ${activeTab === 'recentSessions' ? 'block' : 'hidden'}`}
      >
            <RecentSessions currentMonthName={currentMonthName} totalSessionsInCurrentMonth={totalSessionsInCurrentMonth} sortedSessions={sortedSessions}/>
      </div>
      <div
        id="summaryContent"
        className={`tab-content mt-8 ${activeTab === 'summary' ? 'block' : 'hidden'}`}
      >
            <TotalSummary currentMonthName={currentMonthName} totalSessionsInCurrentMonth={totalSessionsInCurrentMonth} sortedSessions={sortedSessions}/>
      </div>
    </div>
  );
};

export default ProfileTabs;