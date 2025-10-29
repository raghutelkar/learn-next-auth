'use client'

import { useRouter } from 'next/navigation';

const DeleteSessionButton = ({ sessionId, onDelete, onLoadingChange }) => {
    const router = useRouter();

    const handleDelete = async () => {
        try {
            // Notify parent that deletion is starting
            if (onLoadingChange) {
                onLoadingChange(true);
            }
            
            const response = await fetch(`/api/addSession?sessionId=${sessionId}`, {
                method: 'DELETE',
                cache: 'no-cache',
            });
            
            if (response.ok) {
                // Call the onDelete callback if provided
                if (onDelete) {
                    onDelete(true, 'Session deleted successfully!');
                }
                router.refresh();
            } else {
                console.error('Failed to delete session');
                if (onDelete) {
                    onDelete(false, 'Failed to delete session');
                }
            }
        } catch (error) {
            console.error('Error deleting session:', error);
            if (onDelete) {
                onDelete(false, 'Error deleting session');
            }
        } finally {
            // Notify parent that deletion is complete
            if (onLoadingChange) {
                onLoadingChange(false);
            }
        }
    };

    return (
        <button className="mr-4" title="Delete" onClick={handleDelete}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 fill-red-500 hover:fill-red-700"
                          viewBox="0 0 24 24">
                          <path
                            d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                            data-original="#000000" />
                          <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                            data-original="#000000" />
                        </svg>
                      </button>
    );
};

export default DeleteSessionButton;