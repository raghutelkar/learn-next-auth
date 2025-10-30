'use client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import fetchUserData from "@/app/api/utils/fetchUserData";
import RecentSessions from '@/components/RecentSessions';
import TotalSummary from '@/components/TotalSummary';
import Header from '@/components/Header';

const AdminPage = () => {
    const { data: session } = useSession();
    const [selectedUser, setSelectedUser] = useState('');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [activeTab, setActiveTab] = useState('recentSessions');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!session || session?.user?.role !== 'admin') {
            redirect('/');
        }
    }, [session]);

    // Fetch all users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data.users || []);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const months = [
        { value: '', label: 'All Months' },
        { value: '0', label: 'January' },
        { value: '1', label: 'February' },
        { value: '2', label: 'March' },
        { value: '3', label: 'April' },
        { value: '4', label: 'May' },
        { value: '5', label: 'June' },
        { value: '6', label: 'July' },
        { value: '7', label: 'August' },
        { value: '8', label: 'September' },
        { value: '9', label: 'October' },
        { value: '10', label: 'November' },
        { value: '11', label: 'December' }
    ];

    const handleUserChange = async (event) => {
        const selectedName = event.target.value;
        setSelectedUser(selectedName);
        if (selectedName) {
            setLoading(true);
            const data = await fetchUserData(selectedName);
            setUserData(data);
            setLoading(false);
        } else {
            setUserData(null);
        }
    };

    const calculateStats = (sessions) => {
        if (!sessions) return { totalSessions: 0 };
        const filteredSessions = filterSessionsByMonth(sessions);
        return {
            totalSessions: filteredSessions.length,
        };
    };

    const filterSessionsByMonth = (sessions) => {
        if (!sessions) return [];
        if (!selectedMonth) return sessions;
        
        return sessions.filter(session => {
            const sessionDate = new Date(session.date);
            return sessionDate.getMonth() === parseInt(selectedMonth);
        });
    };

    const getFilteredSessions = () => {
        if (!userData?.sessions) return [];
        return filterSessionsByMonth(userData.sessions);
    };

    const getCurrentMonthName = () => {
        if (!selectedMonth) return 'All Time';
        return months.find(m => m.value === selectedMonth)?.label || 'Unknown';
    };

    const sortedSessions = getFilteredSessions().sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <>
            <Header userName={session?.user?.name} userRole={session?.user?.role} />
            <div className="p-6">
                <h2 className='container mx-auto text-xl font-bold pt-6 pb-4'>
                        Dashboard
                    </h2>
                <div className="container mx-auto flex flex-col shadow-lg">
                <div className='pb-4 p-6'>
                    <label htmlFor="userSelect" className="block text-sm font-medium text-gray-700 mb-2">
                        Select User
                    </label>
                    <select
                        id="userSelect"
                        value={selectedUser}
                        onChange={handleUserChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Select a user</option>
                        {users.map((user) => (
                            <option key={user.userId} value={user.name}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>
                {userData && (
                    <div className='pb-6'>
                        <div className='p-6'>
                        <label htmlFor="monthSelect" className="block text-sm font-medium text-gray-700 mb-2">
                            Filter by Month
                        </label>
                        <select
                            id="monthSelect"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {months.map((month) => (
                                <option key={month.value} value={month.value}>
                                    {month.label}
                                </option>
                            ))}
                        </select>
                        </div>
                    <div className="bg-white p-6">
                        <h2 className="text-xl font-bold mb-4">User Profile</h2>
                        <p><strong>Name:</strong> {userData.profile?.name}</p>
                        <p><strong>Email:</strong> {userData.profile?.email}</p>
                        <p className="mt-2"><strong>Total Sessions:</strong> {calculateStats(userData.sessions).totalSessions}</p>
                    </div>
                <div className="space-y-6">
                    {/* Tabs */}
                    <main className='container mx-auto p-4 flex-1'>
                        <ul className="flex bg-gray-100 items-center rounded-md overflow-hidden">
                            <li
                                onClick={() => setActiveTab('recentSessions')}
                                className={`tab font-semibold tracking-wide h-[60px] items-center w-full text-center text-base py-1.5 px-6 cursor-pointer ${
                                    activeTab === 'recentSessions'
                                        ? 'text-white bg-gradient-to-l from-yellow-300 via-green-400 to-yellow-300'
                                        : 'text-slate-600 font-medium'
                                }`}
                            >
                                Recent<br/>Sessions
                            </li>
                            <li
                                onClick={() => setActiveTab('summary')}
                                className={`tab font-semibold tracking-wide h-[60px] border-l border-yellow-400 items-center w-full text-center text-base py-1.5 px-6 cursor-pointer ${
                                    activeTab === 'summary'
                                        ? 'text-white bg-gradient-to-l from-green-400 via-white-400 to-yellow-300'
                                        : 'text-slate-600 font-medium'
                                }`}
                            >
                                Sessions<br/>Summary
                            </li>
                        </ul>

                        <div
                            className={`tab-content mt-8 ${activeTab === 'recentSessions' ? 'block' : 'hidden'}`}
                        >
                            <RecentSessions 
                                currentMonthName={getCurrentMonthName()} 
                                totalSessionsInCurrentMonth={sortedSessions.length} 
                                sortedSessions={sortedSessions}
                            />
                        </div>
                        
                        <div
                            className={`tab-content mt-8 ${activeTab === 'summary' ? 'block' : 'hidden'}`}
                        >
                            <TotalSummary 
                                currentMonthName={getCurrentMonthName()} 
                                totalSessionsInCurrentMonth={sortedSessions.length} 
                                sortedSessions={sortedSessions}
                            />
                        </div>
                    </main>
                </div>
                    </div>
                )}
            </div>

            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                        <p className="mt-4 text-gray-700 font-medium">Loading...</p>
                    </div>
                </div>
            )}

        </div>
        </>
    );
};

export default AdminPage;