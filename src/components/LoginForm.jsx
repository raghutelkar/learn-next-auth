"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";


const LoginForm = () => {
    const router = useRouter();
    const [error, setError] = useState("");

    async function onSubmit(event) {
        event.preventDefault();
        try {
            const formData = new FormData(event.currentTarget);
            const email = formData.get("email");
            const password = formData.get("password");

            // Use client-side signIn so the browser receives the Set-Cookie headers
            const response = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (response?.error) {
                console.error(response.error);
                setError(response.error);
            } else {
                // Navigate to profile after successful sign in
                router.push("/profile");
            }
        } catch (e) {
            console.error(e);
            setError("Check your Credentials");
        }
    }


    return (
        <>
            <div className="text-xl text-red-500">{error}</div>
            <form 
                className="my-5 flex flex-col items-center border p-3 border-gray-200 rounded-md"
                onSubmit={onSubmit}>
                <div className="my-2">
                    <label htmlFor="email">Email Address</label>
                    <input className="border mx-2 border-gray-500 rounded" type="email" name="email" id="email" />
                </div>

                <div className="my-2">
                    <label htmlFor="password">Password</label>
                    <input className="border mx-2 border-gray-500 rounded" type="password" name="password" id="password" />
                </div>

                <button type="submit" className="bg-orange-300 mt-4 rounded flex justify-center items-center w-36">
                    Ceredential Login
                </button>
            </form>
        </>
    );
};

export default LoginForm;
