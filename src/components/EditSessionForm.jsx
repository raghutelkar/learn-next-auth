'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";

const EditSessionForm = ({ session, onCancel }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Format the date to YYYY-MM-DD for the input
    const formattedDate = new Date(session.date).toISOString().split('T')[0];
    
    // Get the hours and minutes from the start time
    const startTime = new Date(session.start).toTimeString().slice(0, 5);
    const endTime = new Date(session.end).toTimeString().slice(0, 5);

    const timeSlots = [
        { label: "6:00 AM - 7:00 AM", start: "06:00", end: "07:00" },
        { label: "7:00 AM - 8:00 AM", start: "07:00", end: "08:00" },
        { label: "8:00 AM - 9:00 AM", start: "08:00", end: "09:00" },
        { label: "5:00 PM - 6:00 PM", start: "17:00", end: "18:00" },
        { label: "6:00 PM - 7:00 PM", start: "18:00", end: "19:00" },
        { label: "7:00 PM - 8:00 PM", start: "19:00", end: "20:00" },
    ];

    // Find the matching time slot
    const selectedTimeSlot = `${startTime},${endTime}`;

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(event.currentTarget);
            
            const selectedDate = formData.get('date');
            const selectedTimeSlot = formData.get('timeSlot');
            const [startTime, endTime] = selectedTimeSlot.split(',');

            const startDateTime = new Date(`${selectedDate}T${startTime}:00`);
            const endDateTime = new Date(`${selectedDate}T${endTime}:00`);

            const response = await fetch(`/api/addSession?sessionId=${session.sessionId}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
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
            
            <div className="my-2 w-full">
                <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 mb-1">
                    Time Slot
                </label>
                <select
                    className="border border-gray-500 rounded p-2 w-full bg-white"
                    name="timeSlot"
                    id="timeSlot"
                    defaultValue={selectedTimeSlot}
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