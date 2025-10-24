'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";

const EditSessionForm = ({ session, onCancel }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMode, setSelectedMode] = useState(session.mode || "");
    const [selectedSessionType, setSelectedSessionType] = useState(session.sessionType || "");
    const [students, setStudents] = useState(session.students || "");
    const [startTime, setStartTime] = useState(new Date(session.start).toTimeString().slice(0, 5));
    const [endTime, setEndTime] = useState(new Date(session.end).toTimeString().slice(0, 5));
    const [timeSlot, setTimeSlot] = useState("");

    // Format the date to YYYY-MM-DD for the input
    const formattedDate = new Date(session.date).toISOString().split('T')[0];

    const timeSlots = [
        { label: "6:00 AM - 7:00 AM", start: "06:00", end: "07:00" },
        { label: "7:00 AM - 8:00 AM", start: "07:00", end: "08:00" },
        { label: "8:00 AM - 9:00 AM", start: "08:00", end: "09:00" },
        { label: "5:00 PM - 6:00 PM", start: "17:00", end: "18:00" },
        { label: "6:00 PM - 7:00 PM", start: "18:00", end: "19:00" },
        { label: "7:00 PM - 8:00 PM", start: "19:00", end: "20:00" },
    ];

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
                    alert('Please select both start and end times');
                    return;
                }
            } else {
                const selectedTimeSlot = formData.get('timeSlot');
                
                if (!selectedTimeSlot) {
                    alert('Please select a time slot');
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
                router.refresh();
                onCancel(); // Close the edit form
            }
        } catch (e) {
            console.error('Error updating session:', e);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="my-5 flex flex-col items-center border p-3 border-gray-200 rounded-md w-full">
            <div className="my-2 w-full">
                <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
                <div className="flex gap-4">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="mode"
                            value="online"
                            checked={selectedMode === "online"}
                            onChange={(e) => setSelectedMode(e.target.value)}
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
                            onChange={(e) => setSelectedMode(e.target.value)}
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
                    onChange={(e) => setSelectedSessionType(e.target.value)}
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
                        {selectedMode === "online" && selectedSessionType === "onlinepersonal" && (
                            <>
                                <option value="Kiran">Kiran</option>
                                <option value="Kusha">Kusha</option>
                                <option value="Romio">Romio</option>
                                <option value="Riya">Riya</option>
                                <option value="Gops">Gops</option>
                            </>
                        )}
                        {selectedMode === "online" && selectedSessionType === "onlineprenatal" && (
                            <>
                                <option value="Ammu">Ammu</option>
                                <option value="Bina">Bina</option>
                                <option value="Chhaya">Chhaya</option>
                                <option value="Dipa">Dipa</option>
                                <option value="Esha">Esha</option>
                            </>
                        )}
                        {selectedMode === "offline" && selectedSessionType === "offlinepersonal" && (
                            <>
                                <option value="Raj">Raj</option>
                                <option value="Ravi">Ravi</option>
                                <option value="Simran">Simran</option>
                                <option value="Aisha">Aisha</option>
                                <option value="Rahul">Rahul</option>
                            </>
                        )}
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
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
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
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
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
                    disabled={isLoading}
                    className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition-colors"
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