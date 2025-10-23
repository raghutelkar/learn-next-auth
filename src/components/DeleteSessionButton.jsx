'use client'

import { useRouter } from 'next/navigation';

const DeleteSessionButton = ({ sessionId }) => {
    const router = useRouter();

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/addSession?sessionId=${sessionId}`, {
                method: 'DELETE',
                cache: 'no-cache',
            });
            
            if (response.ok) {
                router.refresh();
            } else {
                console.error('Failed to delete session');
            }
        } catch (error) {
            console.error('Error deleting session:', error);
        }
    };

    return (
        <button 
            onClick={handleDelete}
            className="bg-red-300 m-4 rounded p-2 hover:bg-red-400 transition-colors"
        >
            Delete
        </button>
    );
};

export default DeleteSessionButton;