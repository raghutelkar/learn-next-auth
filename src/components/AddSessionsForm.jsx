"use client"

import { useRouter } from "next/navigation";
import { useState } from "react"; // Add this import

const AddSessionsForm = ({ userId }) => {
    const router = useRouter();
    const [selectedMode, setSelectedMode] = useState("");
    const [selectedSessionType, setSelectedSessionType] = useState("");
    const [selectedOfflineSessionType, setSelectedOfflineSessionType] = useState("");

    const handleModeChange = (e) => {
        setSelectedMode(e.target.value);
        setSelectedSessionType("");
        setSelectedOfflineSessionType("");
    };

    // Calculate the date range
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

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const formData = new FormData(event.currentTarget);
            
            const selectedDate = formData.get('date');
            let startTime, endTime;

            if (selectedMode === 'online') {
                startTime = formData.get('startTime');
                endTime = formData.get('endTime');
            } else {
                const selectedTimeSlot = formData.get('timeSlot');
                [startTime, endTime] = selectedTimeSlot.split(',');
            }

            const startDateTime = new Date(`${selectedDate}T${startTime}:00`);
            const endDateTime = new Date(`${selectedDate}T${endTime}:00`);

            const response = await fetch(`/api/addSession`, {
                method: 'POST',
                headers: {
                    "content-type": "application/json",
                },
                cache: 'no-cache',
                body: JSON.stringify({
                    userId,
                    sessionId: 's_' + Date.now(),
                    date: new Date(selectedDate).toISOString(),
                    start: startDateTime.toISOString(),
                    end: endDateTime.toISOString(),
                })
            });

            if (response.status === 201) {
                // Force revalidation of all cached data
                router.refresh();
                await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to ensure refresh
                router.push('/profile');
            }

        } catch (e) {
            console.error('Error submitting form:', e.message);
        }
    }

    return (
        <>
            <h2>Add your Session:</h2>
            <form 
                onSubmit={handleSubmit}
                className="my-5 flex flex-col items-center border p-3 border-gray-200 rounded-md w-full max-w-md">
                <div className="my-2 w-full">
                    <label htmlFor="mode" className="block mb-2">Mode</label>
                    <div className="flex gap-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="mode"
                                id="mode"
                                value="online"
                                checked={selectedMode === "online"}
                                onChange={handleModeChange}
                                className="form-radio h-4 w-4 text-orange-300"
                            />
                            <span className="ml-2">Online</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="mode"
                                id="mode"
                                value="offline"
                                checked={selectedMode === "offline"}
                                onChange={handleModeChange}
                                className="form-radio h-4 w-4 text-orange-300"
                            />
                            <span className="ml-2">Offline</span>
                        </label>
                    </div>
                </div>
                
                {selectedMode === "offline" && (
                    <div className="my-2 w-full">
                        <label htmlFor="offlineSessions">Sessions</label>
                        <select
                            className="border mx-2 border-gray-500 rounded p-2 w-full bg-white"
                            name="sessionType"
                            id="offlineSessions"
                            value={selectedOfflineSessionType}
                            onChange={(e) => setSelectedOfflineSessionType(e.target.value)}
                        >
                            <option value="">Please select a session</option>
                            <option value="offlinegeneral">General Session</option>
                            <option value="offlinepersonal">Personal Session</option>
                            <option value="offlineprenatal">Semi-Prenatal Session</option>
                            <option value="offlinesemiprivate">Semi-Private Session</option>
                            <option value="offlinekids">Kids Session</option>
                            <option value="offlineteens">Teens Session</option>
                            <option value="offlineteens">Seniors Citizen Session</option>
                        </select>
                    </div>
                )}
                {selectedMode === "offline" && selectedOfflineSessionType === "offlinepersonal" && (
                    <div className="my-2 w-full">
                        <label htmlFor="personalStudents">Personal Session Students</label>
                        <select
                            className="border mx-2 border-gray-500 rounded p-2 w-full bg-white"
                            name="students"
                            id="personalStudents"
                        >
                            <option value="">Please select a personal session student</option>
                            <option value="personalstudent1">Personal session student1</option>
                            <option value="personalstudent2">Personal session student2</option>
                            <option value="personalstudent3">Personal session student3</option>
                            <option value="personalstudent4">Personal session student4</option>
                            <option value="personalstudent5">Personal session student5</option>
                        </select>
                    </div>
                )}

                {selectedMode === "online" && (
                    <div className="my-2 w-full">
                        <label htmlFor="onlineSessions">Sessions</label>
                        <select
                            className="border mx-2 border-gray-500 rounded p-2 w-full bg-white"
                            name="sessionType"
                            id="onlineSessions"
                            value={selectedSessionType}
                            onChange={(e) => setSelectedSessionType(e.target.value)}
                        >
                            <option value="">Please select a session</option>
                            <option value="onlinepersonal">Personal Session</option>
                            <option value="onlineprenatal">Prenatal Session</option>
                        </select>
                    </div>
                )}
                {selectedSessionType === "onlinepersonal" && (
                    <div className="my-2 w-full">
                        <label htmlFor="personalStudents">Personal Session Students</label>
                        <select
                            className="border mx-2 border-gray-500 rounded p-2 w-full bg-white"
                            name="students"
                            id="personalStudents"
                        >
                            <option value="">Please select a personal session student</option>
                            <option value="personalstudent1">Personal session student1</option>
                            <option value="personalstudent2">Personal session student2</option>
                            <option value="personalstudent3">Personal session student3</option>
                            <option value="personalstudent4">Personal session student4</option>
                            <option value="personalstudent5">Personal session student5</option>
                        </select>
                    </div>
                )}

                {selectedSessionType === "onlineprenatal" && (
                    <div className="my-2 w-full">
                        <label htmlFor="prenatalStudents">Prenatal Session Students</label>
                        <select
                            className="border mx-2 border-gray-500 rounded p-2 w-full bg-white"
                            name="students"
                            id="prenatalStudents"
                        >
                            <option value="">Please select a prenatal session student</option>
                            <option value="prenatalstudent1">Prenatal session student1</option>
                            <option value="prenatalstudent2">Prenatal session student2</option>
                            <option value="prenatalstudent3">Prenatal session student3</option>
                            <option value="prenatalstudent4">Prenatal session student4</option>
                            <option value="prenatalstudent5">Prenatal session student5</option>
                        </select>
                    </div>
                )}

                { (selectedMode === "online" || selectedMode === "offline") && (   
                <div className="my-2 w-full">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Date
                    </label>
                    <input
                        className="border mx-2 border-gray-500 rounded p-2 w-full"
                        type="date"
                        name="date"
                        id="date"
                        min={minDate}
                        max={maxDate}
                        required
                    />
                </div>
            )}

                {selectedMode === "online" || selectedMode === "offline" && selectedOfflineSessionType !== "offlinegeneral" ? (
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
                                    className="border mx-2 border-gray-500 rounded p-2 w-full bg-white"
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
                                    className="border mx-2 border-gray-500 rounded p-2 w-full bg-white"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                ) : ( selectedMode === "online" || selectedMode === "offline" &&
                    <div className="my-2 w-full">  
                        <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 mb-1">
                            Select Time Slot
                        </label>
                        <select
                            className="border mx-2 border-gray-500 rounded p-2 w-full bg-white"
                            name="timeSlot"
                            id="timeSlot"
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
                

                <button
                    type="submit"
                    className="bg-orange-300 mt-4 rounded flex justify-center items-center w-36 p-2 hover:bg-orange-400 transition-colors"
                >
                    Register Session
                </button>
            </form>
        </>
    );
};

export default AddSessionsForm;