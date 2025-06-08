import React, { useState } from 'react';
import Sidebar from '../component/Sidebar';
import userImage from '../assets/user.webp';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function AddBuyer() {
    const [formData, setFormData] = useState({
        personName: "",
        phoneNumber: "",
        email: "",
        password: "",
        companyName: "",
        address: "",
        dropinglocation: "",
        dropingLocations: [],
        categories: [],
        pdfFile: null,
        imageFile: null,
        imagePreview: userImage,
        pdfFileName: "",
        pdfFileUrl: ""
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [categoryOptions,setCategoryOptions] = useState([])
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

    const handleCategoryChange = (event) => {
        const { value, checked } = event.target;
        const selectedCategory = categoryOptions.find(category => category.cat_id === parseInt(value));
        setFormData((prev) => {
            const categories = checked
                ? [...prev.categories, selectedCategory]
                : prev.categories.filter(category => category.cat_id !== parseInt(value));
            return { ...prev, categories };
        });
    };

    const handleClick = async (event) => {
        event.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('password', formData.password);
        formDataToSend.append('personName', formData.personName);
        formDataToSend.append('phoneNumber', formData.phoneNumber);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('companyName', formData.companyName);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('category', JSON.stringify(formData.categories.map(cat => cat.cat_id)));
        formDataToSend.append('dropingaddress', JSON.stringify(formData.dropingLocations));
        if (formData.imageFile) {
            formDataToSend.append('imageFile', formData.imageFile);
        }
        if (formData.pdfFile) {
            formDataToSend.append('pdfFile', formData.pdfFile);
        }

        try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL+'/api/buyer/addbuyer', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate('/dashboard/buyer/buyers');
            toast.success('Buyer added!')
        } catch (error) {
            toast.error(error.response.data.message)
            console.error('Error:', error);
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const toggleCategoryModal = () => {
        setIsCategoryModalOpen(!isCategoryModalOpen);
    };

    const addDroppingLocation = () => {
        if (formData.dropinglocation.trim()) {
            setFormData((prev) => ({
                ...prev,
                dropingLocations: [...prev.dropingLocations, prev.dropinglocation],
                dropinglocation: ""
            }));
        }
    };

    const removeDroppingLocation = (event, index) => {
        event.preventDefault();
        setFormData((prev) => ({
            ...prev,
            dropingLocations: prev.dropingLocations.filter((_, i) => i !== index)
        }));
    };
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL+'/api/category/categories');
                setCategoryOptions(res.data.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, []);
    return (
        <Sidebar page={"Buyers"}>
            <div className='flex flex-col items-center mt-10 p-6 h-auto w-4/5 mx-auto border-2 border-gray-300 shadow-lg rounded-3xl'>
                <div className='flex flex-col items-center mb-10'>
                    <img className='h-24 w-24 bg-cover rounded-full border-4 border-blue-500' src={formData.imagePreview} alt="User" />
                    <label htmlFor="imageFile" className='mt-4 px-4 py-2 bg-gray-400 text-white rounded-3xl cursor-pointer hover:bg-gray-500 transition duration-300'>
                        Upload Image
                    </label>
                    <input type="file" id="imageFile" name="imageFile" accept="image/*" onChange={handleFileChange} className='hidden' />
                </div>

                <form className='flex flex-col items-center w-full'>
                <div className='flex justify-between items-center mb-2 w-3/4'>
        <label htmlFor="personName" className='w-1/4 text-right pr-4'>Person Name:</label>
        <input
            type="text"
            id="personName"
            name='personName'
            value={formData.personName}
            onChange={handleChange}
            className='p-1 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
            maxLength="30"
        />
    </div>

    <div className='flex justify-between items-center mb-2 w-3/4'>
        <label htmlFor="phoneNumber" className='w-1/4 text-right pr-4'>Phone Number:</label>
        {/* <input
            type="tel"
            id="phoneNumber"
            name='phoneNumber'
            value={formData.phoneNumber}
            onChange={handleChange}
            className='p-1 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
            pattern="[0-9]*"
            inputMode="numeric"
        /> */}
        <input
            type="number"
            name='phoneNumber'
            value={formData.phoneNumber}
            onChange={handleChange}
            id='phoneNumber'
            className='placeholder:text-center p-2 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
            pattern="[0-9]*"
            inputMode="numeric"
        />
    </div>

    <div className='flex justify-between items-center mb-2 w-3/4'>
        <label htmlFor="email" className='w-1/4 text-right pr-4'>Email:</label>
        <input
            type="email"
            id="email"
            name='email'
            value={formData.email}
            onChange={handleChange}
            className='p-1 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
    </div>

    <div className='flex justify-between items-center mb-2 w-3/4'>
        <label htmlFor="companyName" className='w-1/4 text-right pr-4'>Company Name:</label>
        <input
            type="text"
            id="companyName"
            name='companyName'
            value={formData.companyName}
            onChange={handleChange}
            className='p-1 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
    </div>

    <div className='flex justify-between items-center mb-2 w-3/4'>
        <label htmlFor="address" className='w-1/4 text-right pr-4'>Address:</label>
        <input
            type="text"
            id="address"
            name='address'
            value={formData.address}
            onChange={handleChange}
            className='p-1 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
    </div>

    <div className='flex w-3/4 mb-2'>
        <label htmlFor="dropinglocation" className='w-1/4 text-right pr-4'>Dropping Location:</label>
        <div className='flex w-3/4'>
            <input
                type="text"
                id="dropinglocation"
                name='dropinglocation'
                value={formData.dropinglocation}
                onChange={handleChange}
                className='p-1 w-full border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <button type="button" onClick={addDroppingLocation} className='ml-2 px-4 py-1 bg-green-600 text-white rounded-3xl hover:bg-green-700 transition duration-300'>
                Add
            </button>
        </div>
    </div>
                    <div className='w-3/4 mb-4'>
                        {formData.dropingLocations.map((location, index) => (
                            <div key={index} className='flex justify-between items-center p-2 mb-2 border border-gray-300 rounded-3xl'>
                                <span>{location}</span>
                                    <span type="button" onClick={(event) => removeDroppingLocation(event, index)} className='text-red-500  cursor-pointer'>
                                        &times;
                                    </span>
                            </div>
                        ))}
                    </div>
                    <div className='w-3/4 mb-4'>
                        <button type="button" onClick={toggleCategoryModal} className='w-full px-4 py-2 bg-gray-400 text-white rounded-3xl cursor-pointer hover:bg-gray-500 transition duration-300'>
                            Select Categories
                        </button>
                        <div className='mt-2'>
                            {formData.categories.map((category) => (
                                <span key={category.cat_id} className='inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2'>{category.cat_name}</span>
                            ))}
                        </div>
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
                        <button className='px-6 py-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition duration-300'
                        onClick={()=>{navigate('/dashboard/buyer/buyers')}}>
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

            {isCategoryModalOpen && (
                <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50'>
                    <div className='bg-white p-6 rounded-lg shadow-lg w-4/5 h-4/5 overflow-y-auto'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-bold'>Select Categories</h2>
                            
                        </div>
                        {categoryOptions.map((category) => (
                            <div key={category.cat_id} className='flex items-center mb-2'>
                                <input
                                    type="checkbox"
                                    id={`category-${category.cat_id}`}
                                    name='categories'
                                    value={category.cat_id}
                                    checked={formData.categories.some(cat => cat.cat_id === category.cat_id)}
                                    onChange={handleCategoryChange}
                                    className='mr-2'
                                />
                                <label htmlFor={`category-${category.cat_id}`}>{category.cat_name}</label>
                            </div>
                        ))}
                        <button onClick={toggleCategoryModal} className='px-6 py-2 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition duration-300'>done</button>
                    </div>
                </div>
            )}
        </Sidebar>
    );
}
