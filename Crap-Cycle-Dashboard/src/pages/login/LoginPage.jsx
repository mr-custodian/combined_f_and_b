import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await login(credentials.email, credentials.password);
        if (response.status === 200) {
            const redirectTo = location.state?.from || '/';
            navigate(redirectTo);
        } else {
            toast.error(response.data.message);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <div className='flex flex-col items-center p-6 h-auto w-4/5 md:w-1/3 border-2 border-gray-300 shadow-lg rounded-3xl'>
                <h1 className='text-2xl mb-6'>Login</h1>
                <form onSubmit={handleSubmit} className='flex flex-col items-center w-full'>
                    <input
                        type="text"
                        name='email'
                        value={credentials.email}
                        onChange={handleChange}
                        placeholder='email'
                        className='placeholder:text-center mb-4 p-1 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                        type="password"
                        name='password'
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder='Password'
                        className='placeholder:text-center mb-4 p-1 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <div className='flex items-center'>
                        <button
                            type="submit"
                            className='px-6 py-2 mr-10 bg-green-600 text-white rounded-3xl hover:bg-green-700 transition duration-300'
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            className='px-6 py-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition duration-300'
                            onClick={() => navigate('/')} // Redirect to home or another page
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
