import Logout from "@/components/Logout";
import { auth } from "@/auth";
import Link from "next/link";
import AddSessionsForm from "@/components/AddSessionsForm";

import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic'

const HomePage = async () => {
    const session = await auth();

    if (!session?.user) redirect("/");

    const fetchUserData = async (name) => {
        try {
            const response = await fetch(`http://localhost:3000/api/users?name=${name}`, {
                cache: 'no-cache',
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
    const data = await fetchUserData(session?.user?.name);

    return (
        <div className="flex flex-col items-center m-4">
            {session?.user?.name && (
                <>
                    <h1 className="text-3xl my-2">
                        Welcome, {session?.user?.name}
                    </h1>
                    <br/>
                    <h2>Your Previous Sessions:</h2>
                    {data?.sessions && <ul>
                        {data?.sessions.map(session => (
                            <li key={session.id} className="border border-black p-2">
                                {new Date(session.date).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} - {new Date(session.start).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' })} to {new Date(session.end).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                            </li>
                        ))}
                    </ul>
                    }
                    {data?.profile?.role === 'admin' && (
                        <p className="my-3">
                        Don't you have an account?
                        <Link href="register" className="mx-2 underline">Register</Link>
                    </p>
                    )}
                    <br/>
                    <h2>Add your Session:</h2>
                    <AddSessionsForm userId={data?.profile?.userId} />
                </>
            )}
            <Logout />
        </div>
    );
};

export default HomePage;
