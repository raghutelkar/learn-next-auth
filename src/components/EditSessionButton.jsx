'use client'

import { useState } from 'react';
import EditSessionForm from './EditSessionForm';

const EditSessionButton = ({ session }) => {
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return (
            <EditSessionForm 
                session={session} 
                onCancel={() => setIsEditing(false)} 
            />
        );
    }

    return (
        <button 
            onClick={() => setIsEditing(true)}
            className="bg-blue-300 m-4 rounded p-2 hover:bg-blue-400 transition-colors"
        >
            Edit
        </button>
    );
};

export default EditSessionButton;