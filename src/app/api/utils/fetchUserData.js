    const fetchUserData = async (name) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users?name=${name}`, {
                cache: 'no-cache',
                next: { revalidate: 0, tags: ['sessions'] }
            });
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
            return await response.json();
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    }

    export default fetchUserData;