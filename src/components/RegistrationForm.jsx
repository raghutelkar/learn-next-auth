"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const RegistrationForm = () => {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session || session?.user?.role !== 'admin') {
            redirect('/');
        }
    }, [session]);

    async function handleSubmit(event) {
      event.preventDefault();

      try {
        const formData = new FormData(event.currentTarget);

        const userId = 'YogaUser_' + Date.now();
        const name = formData.get('name');
        const role = formData.get('role');
        const email = formData.get('email');
        const password = formData.get('password');

        const response = await fetch(`/api/register`, {
          method: 'POST',
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            userId,
            name,
            email,
            password,
            role
          })
        });

        response.status === 201 && router.push('/');
        

      } catch (e) {
        console.error(e.message)
      }
    }

    return (
        <>
            <form 
              onSubmit={handleSubmit}
              className="my-5 flex flex-col items-center border p-3 border-gray-200 rounded-md">
                <div className="my-2">
                    <label htmlFor="email">Name</label>
                    <input
                        className="border mx-2 border-gray-500 rounded"
                        type="text"
                        name="name"
                        id="name"
                    />
                </div>
                <div className="my-2">
                    <label htmlFor="role">Role</label>
                    <select
                        className="border mx-2 border-gray-500 rounded"
                        name="role"
                        id="role"
                        defaultValue="user"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="my-2">  
                    <label htmlFor="email">Email Address</label>
                    <input
                        className="border mx-2 border-gray-500 rounded"
                        type="email"
                        name="email"
                        id="email"
                    />
                </div>

                <div className="my-2">
                    <label htmlFor="password">Password</label>
                    <input
                        className="border mx-2 border-gray-500 rounded"
                        type="password"
                        name="password"
                        id="password"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-orange-300 mt-4 rounded flex justify-center items-center w-36"
                >
                    Register
                </button>
            </form>
        </>
    );
};

export default RegistrationForm;
