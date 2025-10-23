"use client"

import { useRouter } from "next/navigation";

const AddSessionsForm = ({ userId }) => {
    const router = useRouter();

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
            
            // Get the selected date and time slot
            const selectedDate = formData.get('date');
            const selectedTimeSlot = formData.get('timeSlot');
            const [startTime, endTime] = selectedTimeSlot.split(',');

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
            <form 
                onSubmit={handleSubmit}
                className="my-5 flex flex-col items-center border p-3 border-gray-200 rounded-md w-full max-w-md">
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