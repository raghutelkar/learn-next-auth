'use client'
import { useState, useEffect } from 'react';
import fetchUserData from "@/app/api/utils/fetchUserData";

const AdminPage = () => {
    const [selectedUser, setSelectedUser] = useState('');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('');

    const users = [
        { userId: 'YogaUser_1761134495692', name: 'Varsha' },
        { userId: 'YogaUser_1761137134728', name: 'Raghu' },
        { userId: 'YogaUser_1761201827965', name: 'Hridhi' }
    ];

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

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
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
                    <div>
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
                )}
            </div>

            {loading && <div>Loading...</div>}

            {userData && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">User Profile</h2>
                        <p>Name: {userData.profile?.name}</p>
                        <p>Email: {userData.profile?.email}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Statistics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-indigo-50 p-4 rounded">
                                <p className="text-sm text-indigo-600">
                                    {selectedMonth ? `Sessions in ${months.find(m => m.value === selectedMonth)?.label}` : 'Total Sessions'}
                                </p>
                                <p className="text-2xl font-bold">
                                    {calculateStats(userData.sessions).totalSessions}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">
                            Session History 
                            {selectedMonth && (
                                <span className="text-sm font-normal ml-2 text-gray-600">
                                    ({months.find(m => m.value === selectedMonth)?.label})
                                </span>
                            )}
                        </h2>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {getFilteredSessions().length > 0 ? (
                                getFilteredSessions().map((session, index) => (
                                    <div key={index} className="border-b pb-4">
                                        <p>Date: {new Date(session.date).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        <p>Time: {new Date(session.start).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' })} to {new Date(session.end).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' })}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No sessions found for the selected period</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;