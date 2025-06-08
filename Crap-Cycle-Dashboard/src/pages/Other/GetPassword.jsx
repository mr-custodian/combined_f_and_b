import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../../component/Sidebar';
import { ToastContainer, toast } from 'react-toastify';

export default function GetPassword() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(import.meta.env.VITE_BACKEND_URL+`/api/vendor/get-password?email=${email}`);
            console.log(response);
            if (response.data.data) {
                setPassword(response.data.data);
                toast.success('Password retrieved successfully');
            } else {
                toast.error('No password found for this email');
            }
        } catch (error) {
            console.error('Error fetching password:', error);
            toast.error('Failed to fetch password');
        }
    };

    return (
        <Sidebar page="Get Password">
            <div className="container mx-auto pt-10">
                <h2 className="text-2xl font-bold mb-5">Get Password</h2>
                <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="Enter email"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition ease-in-out duration-300"
                    >
                        Search
                    </button>
                </form>

                {password && (
                    <div className="mt-6">
                        <h3 className="text-lg font-bold">Password:</h3>
                        <p className="text-gray-800">{password}</p>
                    </div>
                )}
            </div>
            <ToastContainer />
        </Sidebar>
    );
}
