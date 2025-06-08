import React, { useState } from 'react';
import Sidebar from '../component/Sidebar';
import userImage from '../assets/user.webp';
import axios from 'axios'; // Import axios for making HTTP requests
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddVendor() {
    const [formData, setFormData] = useState({
        personName: "",
        phoneNumber: "",
        email: "",
        companyName: "",
        address: "",
        location: "",
        pdfFile: null,
        imageFile: null,
        imagePreview: userImage,
        pdfFileName: "",
        pdfFileUrl: ""
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const handleChange = (event) => {
        const { name, value } = event.target;
    
        setFormData((prev) => {
            // Apply validation only for 'personName'
            if (name === 'personName') {
                // Allow only alphabets and spaces, up to 30 characters
                if (/^[a-zA-Z\s]*$/.test(value)) {
                    return {
                        ...prev,
                        [name]: value
                    };
                } else {
                    // Return previous state if the value doesn't match the regex
                    return prev;
                }
            }
    
            // No validation for other fields, just update the state
            return {
                ...prev,
                [name]: value
            };
        });
    };

    const handleFileChange = (event) => {
        const { name, files } = event.target;
        if (files.length > 0) {
            const file = files[0];
            setFormData((prev) => ({
                ...prev,
                [name]: file,
                imagePreview: name === 'imageFile' ? URL.createObjectURL(file) : prev.imagePreview,
                pdfFileName: name === 'pdfFile' ? file.name : prev.pdfFileName,
                pdfFileUrl: name === 'pdfFile' ? URL.createObjectURL(file) : prev.pdfFileUrl
            }));
        }
    };

    const handleClick = async (event) => {
        event.preventDefault();
        const data = new FormData();
        data.append('personName', formData.personName);
        data.append('phoneNumber', formData.phoneNumber);
        data.append('email', formData.email);
        data.append('companyName', formData.companyName);
        data.append('address', formData.address);
        data.append('location', formData.location);
        data.append('pdfFile', formData.pdfFile);
        data.append('imageFile', formData.imageFile);
        data.append('password', 'yourPassword'); // Include a password if required

        try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/delivery/add-agent', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // console.log(response.data);
            toast.success("Delvery Agent added!");
            navigate('/dashboard/delivery_agent/allgents')
            // Handle successful response
        } catch (err) {
            console.error('Error adding delivery agent:', err);
            toast.error(err.response.data.message)
            // Handle error response
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <Sidebar page={"Delivery Agent"}>
            <div className='flex flex-col items-center mt-10 p-6 h-auto w-4/5 mx-auto border-2 border-gray-300 shadow-lg rounded-3xl'>
                <div className='flex flex-col items-center mb-10'>
                    <img className='h-24 w-24 bg-cover rounded-full border-4 border-blue-500' src={formData.imagePreview} alt="User" />
                    <label htmlFor="imageFile" className='mt-4 px-4 py-2 bg-gray-400 text-white rounded-3xl cursor-pointer hover:bg-gray-500 transition duration-300'>
                        Upload Image
                    </label>
                    <input type="file" id="imageFile" name="imageFile" accept="image/*" onChange={handleFileChange} className='hidden' />
                </div>

                <form className='flex flex-col items-center w-full'>
                    <div className='flex items-center w-3/4 mb-4'>
                        <label htmlFor='personName' className='w-1/4 text-right mr-4'>Person Name</label>
                        <input
                            type="text"
                            name='personName'
                            id='personName'
                            value={formData.personName}
                            onChange={handleChange}
                            className='p-3 w-full border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                            maxLength="30"
                        />
                    </div>

                    <div className='flex items-center w-3/4 mb-4'>
                        <label htmlFor='phoneNumber' className='w-1/4 text-right mr-4'>Phone Number</label>
                        <input
                            type="number"
                            name="phoneNumber"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            id="phoneNumber"
                            className="p-3 w-full border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            
                        />


                    </div>

                    <div className='flex items-center w-3/4 mb-4'>
                        <label htmlFor='email' className='w-1/4 text-right mr-4'>Email Id</label>
                        <input
                            type="email"
                            name='email'
                            id='email'
                            value={formData.email}
                            onChange={handleChange}
                            className='p-3 w-full border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>

                    <div className='flex items-center w-3/4 mb-4'>
                        <label htmlFor='companyName' className='w-1/4 text-right mr-4'>Company Name</label>
                        <input
                            type="text"
                            name='companyName'
                            id='companyName'
                            value={formData.companyName}
                            onChange={handleChange}
                            className='p-3 w-full border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>

                    <div className='flex items-center w-3/4 mb-4'>
                        <label htmlFor='address' className='w-1/4 text-right mr-4'>Address</label>
                        <input
                            type="text"
                            name='address'
                            id='address'
                            value={formData.address}
                            onChange={handleChange}
                            className='p-3 w-full border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>

                    <div className='flex items-center w-3/4 mb-4'>
                        <label htmlFor='location' className='w-1/4 text-right mr-4'>Location</label>
                        <input
                            type="text"
                            name='location'
                            id='location'
                            value={formData.location}
                            onChange={handleChange}
                            className='p-3 w-full border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>

                    <label htmlFor="pdfFile" className='mb-4 px-4 py-2 bg-gray-400 text-white rounded-3xl cursor-pointer hover:bg-gray-500 transition duration-300'>
                        Upload Document
                    </label>
                    <input type="file" id="pdfFile" name="pdfFile" accept="application/pdf" onChange={handleFileChange} className='hidden' />
                    {formData.pdfFileName && <p className='mb-4 cursor-pointer text-blue-500' onClick={toggleModal}>Uploaded PDF: {formData.pdfFileName}</p>}
                    <div className='flex items-center'>
                        <button
                            onClick={handleClick}
                            className='px-6 py-2 mr-10 bg-green-600 text-white rounded-3xl hover:bg-green-700 transition duration-300'
                        >
                            Submit
                        </button>
                        <button onClick={() => { navigate('/dashboard/delivery_agent/allgents') }} className='px-6 py-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition duration-300'>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
            {isModalOpen && (
                <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50'>
                    <div className='bg-white p-6 rounded-lg shadow-lg w-4/5 h-4/5'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-bold'>Uploaded Document</h2>
                            <button onClick={toggleModal} className='text-red-500 text-xl'>&times;</button>
                        </div>
                        <iframe src={formData.pdfFileUrl} className='w-full h-full border'></iframe>
                    </div>
                </div>
            )}
        </Sidebar>
    );
}
