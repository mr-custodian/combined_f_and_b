import React, { useState, useEffect } from 'react';
import Sidebar from '../../component/Sidebar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
export default function UpdateContact() {
    const [contactInfo, setContactInfo] = useState({
        payment_related_mobile: '',
        delivery_related_mobile: '',
        application_related_mobile: '',
        payment_related_email: '',
        delivery_related_email: '',
        application_related_email: ''
    });

    useEffect(() => {
        // Fetch existing contact information
        const fetchContactInfo = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_BACKEND_URL+'/api/other/contact');
                setContactInfo(response.data);
            } catch (error) {
                console.error('Error fetching contact info:', error);
            }
        };

        fetchContactInfo();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContactInfo({ ...contactInfo, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(import.meta.env.VITE_BACKEND_URL+'/api/other/contact', contactInfo);
            // toast.success('Contact information updated successfully');
            window.alert("Contact information updated successfully");

        } catch (error) {
            console.error('Error updating contact info:', error);
        }
    };

    return (
        <Sidebar page="Update Contact">
            <div className="container mx-auto pt-10">
                <h2 className="text-2xl font-bold mb-5">Update Contact</h2>
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="mb-4">
                        <label className="block text-gray-700">Payment Related Mobile</label>
                        <input
                            type="text"
                            name="payment_related_mobile"
                            value={contactInfo.payment_related_mobile}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Delivery Related Mobile</label>
                        <input
                            type="text"
                            name="delivery_related_mobile"
                            value={contactInfo.delivery_related_mobile}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Application Related Mobile</label>
                        <input
                            type="text"
                            name="application_related_mobile"
                            value={contactInfo.application_related_mobile}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Payment Related Email</label>
                        <input
                            type="email"
                            name="payment_related_email"
                            value={contactInfo.payment_related_email}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Delivery Related Email</label>
                        <input
                            type="email"
                            name="delivery_related_email"
                            value={contactInfo.delivery_related_email}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Application Related Email</label>
                        <input
                            type="email"
                            name="application_related_email"
                            value={contactInfo.application_related_email}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition ease-in-out duration-300"
                    >
                        Save
                    </button>
                </form>
            </div>
        </Sidebar>
    );
}
