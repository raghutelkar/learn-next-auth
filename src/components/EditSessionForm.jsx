'use client'

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from 'motion/react';

const EditSessionForm = ({ session, onCancel, onEdit }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedMode, setSelectedMode] = useState(session.mode || "");
    const [selectedSessionType, setSelectedSessionType] = useState(session.sessionType || "");
    const [students, setStudents] = useState(session.students || "");
    const [studentsList, setStudentsList] = useState([]);
    const [startTime, setStartTime] = useState(new Date(session.start).toTimeString().slice(0, 5));
    const [endTime, setEndTime] = useState(new Date(session.end).toTimeString().slice(0, 5));
    
    // Initialize timeSlot with existing session times if it's an offline general session
    const initialTimeSlot = session.mode === "offline" && session.sessionType === "offlinegeneral" 
        ? `${new Date(session.start).toTimeString().slice(0, 5)},${new Date(session.end).toTimeString().slice(0, 5)}`
        : "";
    const [timeSlot, setTimeSlot] = useState(initialTimeSlot);

    // Fetch students based on mode and session type
    useEffect(() => {
        const fetchStudents = async () => {
            let mode = selectedMode;
            let type = null;

            // Determine the type based on session type
            if (selectedMode === 'online') {
                if (selectedSessionType === 'onlinepersonal') {
                    type = 'personal';
                } else if (selectedSessionType === 'onlineprenatal') {
                    type = 'prenatal';
                }
            } else if (selectedMode === 'offline') {
                if (selectedSessionType === 'offlinepersonal') {
                    type = 'personal';
                }
            }

            // Only fetch if we have both mode and type
            if (mode && type) {
                try {
                    const response = await fetch(`/api/addStudent?mode=${mode}&type=${type}`);
                    if (response.ok) {
                        const data = await response.json();
                        setStudentsList(data.students || []);
                    } else {
                        setStudentsList([]);
                    }
                } catch (error) {
                    console.error('Error fetching students:', error);
                    setStudentsList([]);
                }
            } else {
                setStudentsList([]);
            }
        };

        fetchStudents();
    }, [selectedMode, selectedSessionType]);

    // Handle mode change and reset dependent fields
    const handleModeChange = (newMode) => {
        setSelectedMode(newMode);
        setSelectedSessionType("");
        setStudents("");
        setStudentsList([]);
        setTimeSlot("");
    };

    // Validate time to only allow 00, 15, 30, 45 minutes
    const validateTime = (timeValue) => {
        if (!timeValue) return timeValue;
        const [hours, minutes] = timeValue.split(':');
        const validMinutes = ['00', '15', '30', '45'];
        if (!validMinutes.includes(minutes)) {
            // Round to nearest valid minute
            const minuteNum = parseInt(minutes);
            let roundedMinute;
            if (minuteNum < 8) roundedMinute = '00';
            else if (minuteNum < 23) roundedMinute = '15';
            else if (minuteNum < 38) roundedMinute = '30';
            else if (minuteNum < 53) roundedMinute = '45';
            else roundedMinute = '00';
            return `${hours}:${roundedMinute}`;
        }
        return timeValue;
    };

    // Format the date to YYYY-MM-DD for the input
    const formattedDate = new Date(session.date).toISOString().split('T')[0];

    // Calculate the date range (same as AddSessionsForm)
    const today = new Date();
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(today.getDate() - 5);

    // Format dates to YYYY-MM-DD for the input attributes
    const maxDate = today.toISOString().split('T')[0];
    const minDate = fiveDaysAgo.toISOString().split('T')[0];

    const timeSlots = [
        { label: "6:00 AM - 7:00 AM", start: "06:00", end: "07:00" },
        { label: "7:00 AM - 8:00 AM", start: "07:00", end: "08:00" },
        { label: "8:00 AM - 9:00 AM", start: "08:00", end: "09:00" },
        { label: "5:00 PM - 6:00 PM", start: "17:00", end: "18:00" },
        { label: "6:00 PM - 7:00 PM", start: "18:00", end: "19:00" },
        { label: "7:00 PM - 8:00 PM", start: "19:00", end: "20:00" },
    ];

    // Check if all required fields are filled
    const isFormValid = () => {
        // Mode must be selected
        if (!selectedMode) return false;

        // Session type must be selected
        if (!selectedSessionType) return false;

        // Check student selection for personal/prenatal sessions
        if (selectedMode === "online") {
            if ((selectedSessionType === "onlinepersonal" || selectedSessionType === "onlineprenatal") && !students) {
                return false;
            }
            // Time must be selected for online sessions and different
            if (!startTime || !endTime) return false;
            if (startTime === endTime) return false;
        } else if (selectedMode === "offline") {
            // Student required for offline personal
            if (selectedSessionType === "offlinepersonal" && !students) {
                return false;
            }
            
            // Time validation based on session type
            if (selectedSessionType === "offlinegeneral") {
                if (!timeSlot) return false;
            } else {
                if (!startTime || !endTime) return false;
                if (startTime === endTime) return false;
            }
        }

        return true;
    };

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(event.currentTarget);
            
            const selectedDate = formData.get('date');
            let startTime, endTime;

            // Determine how to get time based on session type
            if (selectedMode === 'online' || (selectedMode === 'offline' && selectedSessionType !== 'offlinegeneral')) {
                startTime = formData.get('startTime');
                endTime = formData.get('endTime');
                
                if (!startTime || !endTime) {
                    setError('Please select both start and end times');
                    setIsLoading(false);
                    setTimeout(() => setError(''), 5000);
                    return;
                }

                // Validate duration doesn't exceed 90 minutes
                const [startHours, startMinutes] = startTime.split(':').map(Number);
                const [endHours, endMinutes] = endTime.split(':').map(Number);
                const startTimeInMinutes = startHours * 60 + startMinutes;
                const endTimeInMinutes = endHours * 60 + endMinutes;
                const durationInMinutes = endTimeInMinutes - startTimeInMinutes;

                if (durationInMinutes > 90) {
                    setError('Session duration cannot exceed 90 minutes');
                    setIsLoading(false);
                    setTimeout(() => setError(''), 5000);
                    return;
                }

                if (durationInMinutes <= 0) {
                    setError('End time must be after start time');
                    setIsLoading(false);
                    setTimeout(() => setError(''), 5000);
                    return;
                }
            } else {
                const selectedTimeSlot = formData.get('timeSlot');
                
                if (!selectedTimeSlot) {
                    setError('Please select a time slot');
                    setIsLoading(false);
                    setTimeout(() => setError(''), 5000);
                    return;
                }
                
                [startTime, endTime] = selectedTimeSlot.split(',');
            }

            const startDateTime = new Date(`${selectedDate}T${startTime}:00`);
            const endDateTime = new Date(`${selectedDate}T${endTime}:00`);

            const response = await fetch(`/api/addSession?sessionId=${session.sessionId}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mode: formData.get('mode'),
                    sessionType: formData.get('sessionType'),
                    students: formData.get('students') || 'N/A',
                    date: new Date(selectedDate).toISOString(),
                    start: startDateTime.toISOString(),
                    end: endDateTime.toISOString(),
                })
            });

            if (response.ok) {
                // Call the onEdit callback if provided
                if (onEdit) {
                    onEdit(true, 'Session updated successfully!');
                }
                router.refresh();
                onCancel(); // Close the edit form
            } else if (response.status === 409) {
                const errorMessage = await response.text();
                setError(errorMessage);
                setTimeout(() => setError(''), 5000);
            } else {
                const errorMessage = await response.text();
                setError(errorMessage || 'Failed to update session');
                setTimeout(() => setError(''), 5000);
            }
        } catch (e) {
            console.error('Error updating session:', e);
            setError('Error updating session');
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="my-5 flex flex-col items-center border p-3 border-gray-200 rounded-md w-full">
            {error && (
                <motion.div
                    className='flex items-start bg-red-100 text-red-800 p-3 mb-4 rounded-lg relative lg:flex w-full'
                    role='alert'
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: 'loop',
                    }}
                >
                    <div className='flex items-center gap-3'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='w-5 h-5 shrink-0 fill-red-500 inline'
                            viewBox='0 0 32 32'
                        >
                            <path
                                d='M16 1a15 15 0 1 0 15 15A15 15 0 0 0 16 1zm6.36 20L21 22.36l-5-4.95-4.95 4.95L9.64 21l4.95-5-4.95-4.95 1.41-1.41L16 14.59l5-4.95 1.41 1.41-5 4.95z'
                                data-original='#ea2d3f'
                            />
                        </svg>
                        <span className='font-semibold text-[14px] inline-block mr-2'>
                            Error!
                        </span>
                        <span className='block text-sm font-medium sm:inline'>{error}</span>
                    </div>
                </motion.div>
            )}
            <div className="my-2 w-full">
                <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
                <div className="flex gap-4">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="mode"
                            value="online"
                            checked={selectedMode === "online"}
                            onChange={(e) => handleModeChange(e.target.value)}
                            className="form-radio h-4 w-4 text-orange-300"
                        />
                        <span className="ml-2">Online</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="mode"
                            value="offline"
                            checked={selectedMode === "offline"}
                            onChange={(e) => handleModeChange(e.target.value)}
                            className="form-radio h-4 w-4 text-orange-300"
                        />
                        <span className="ml-2">Offline</span>
                    </label>
                </div>
            </div>

            <div className="my-2 w-full">
                <label htmlFor="sessionType" className="block text-sm font-medium text-gray-700 mb-1">
                    Session Type
                </label>
                <select
                    className="border border-gray-500 rounded p-2 w-full bg-white"
                    name="sessionType"
                    id="sessionType"
                    value={selectedSessionType}
                    onChange={(e) => {
                        setSelectedSessionType(e.target.value);
                        setStudents("");
                        setStudentsList([]);
                    }}
                    required
                >
                    <option value="">Please select a session type</option>
                    {selectedMode === "online" ? (
                        <>
                            <option value="onlinepersonal">Personal</option>
                            <option value="onlineprenatal">Prenatal</option>
                        </>
                    ) : (
                        <>
                            <option value="offlinegeneral">General</option>
                            <option value="offlinepersonal">Personal</option>
                            <option value="offlineprenatal">Semi-Prenatal</option>
                            <option value="offlinesemiprivate">Semi-Private</option>
                            <option value="offlinekids">Kids</option>
                            <option value="offlineteens">Teens</option>
                            <option value="offlineseniors">Seniors Citizen</option>
                        </>
                    )}
                </select>
            </div>

            {((selectedMode === "online" && (selectedSessionType === "onlinepersonal" || selectedSessionType === "onlineprenatal")) ||
              (selectedMode === "offline" && selectedSessionType === "offlinepersonal")) && (
                <div className="my-2 w-full">
                    <label htmlFor="students" className="block text-sm font-medium text-gray-700 mb-1">
                        Students
                    </label>
                    <select
                        className="border border-gray-500 rounded p-2 w-full bg-white"
                        name="students"
                        id="students"
                        value={students}
                        onChange={(e) => setStudents(e.target.value)}
                        required
                    >
                        <option value="">Please select</option>
                        {studentsList.map((student) => (
                            <option key={student.studentId} value={student.studentName}>
                                {student.studentName}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="my-2 w-full">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                </label>
                <input
                    className="border border-gray-500 rounded p-2 w-full"
                    type="date"
                    name="date"
                    id="date"
                    min={minDate}
                    max={maxDate}
                    defaultValue={formattedDate}
                    required
                />
            </div>
            
            {(selectedMode === "online" || (selectedMode === "offline" && selectedSessionType !== "offlinegeneral")) ? (
                <div className="my-2 w-full">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                                Start Time
                            </label>
                            <input
                                type="time"
                                id="startTime"
                                name="startTime"
                                min="05:00"
                                max="19:00"
                                step="900"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                onBlur={(e) => setStartTime(validateTime(e.target.value))}
                                className="border border-gray-500 rounded p-2 w-full bg-white"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                                End Time
                            </label>
                            <input
                                type="time"
                                id="endTime"
                                name="endTime"
                                min="05:00"
                                max="19:00"
                                step="900"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                onBlur={(e) => setEndTime(validateTime(e.target.value))}
                                className="border border-gray-500 rounded p-2 w-full bg-white"
                                required
                            />
                        </div>
                    </div>
                </div>
            ) : (selectedMode === "offline" && selectedSessionType === "offlinegeneral") && (
                <div className="my-2 w-full">  
                    <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Time Slot
                    </label>
                    <select
                        className="border border-gray-500 rounded p-2 w-full bg-white"
                        name="timeSlot"
                        id="timeSlot"
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        required
                    >
                        <option value="">Select a time slot</option>
                        {timeSlots.map((slot, index) => (
                            <option 
                                key={index} 
                                value={`${slot.start},${slot.end}`}
                            >
                                {slot.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="flex gap-2 mt-4">
                <button
                    type="submit"
                    disabled={!isFormValid() || isLoading}
                    className={`rounded px-4 py-2 transition-colors ${
                        isFormValid() && !isLoading
                            ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                    }`}
                >
                    {isLoading ? 'Updating...' : 'Update Session'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-300 rounded px-4 py-2 hover:bg-gray-400 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default EditSessionForm;