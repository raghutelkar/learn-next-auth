'use client'

import { useState } from 'react';
import EditSessionForm from './EditSessionForm';

const EditSessionButton = ({ session }) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <>
            <button 
                onClick={() => setIsEditing(true)}
                className="bg-blue-300 m-4 rounded p-2 hover:bg-blue-400 transition-colors"
            >
                Edit
            </button>

            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 relative">
                        <button 
                            onClick={() => setIsEditing(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            aria-label="Close"
                        >
                            ×
                        </button>
                        <h2 className="text-xl font-bold mb-4">Edit Session</h2>
                        <EditSessionForm 
                            session={session} 
                            onCancel={() => setIsEditing(false)} 
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default EditSessionButton;