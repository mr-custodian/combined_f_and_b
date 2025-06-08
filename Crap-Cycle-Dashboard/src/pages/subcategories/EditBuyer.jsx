import React, { useState } from 'react';
import Sidebar from '../component/Sidebar';
import userImage from '../assets/user.webp';
import { useNavigate } from 'react-router-dom';
export default function EditBuyer() {
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
    const navigate = useNavigate();

    const categoryOptions = [
        { cat_id: 1, name: "steel" },
        { cat_id: 2, name: "plastic" }
    ];

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
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
        formDataToSend.append('imageFile', formData.imageFile);
        formDataToSend.append('pdfFile', formData.pdfFile);

        try {
            const response = await fetch('http://localhost:3000/api/buyer/addbuyer', {
                method: 'POST',
                body: formDataToSend
            });

            if (!response.ok) {
                throw new Error('Error adding buyer');
            }

            const data = await response.json();
            console.log('Response:', data);
            navigate('/buyers')
            // Optionally, you can handle success and redirect or show a success message
        } catch (error) {
            console.error('Error:', error.message);
            // Handle error state, show error message, etc.
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

    const removeDroppingLocation = (index) => {
        setFormData((prev) => ({
            ...prev,
            dropingLocations: prev.dropingLocations.filter((_, i) => i !== index)
        }));
    };
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
                    <input
                        type="text"
                        name='personName'
                        value={formData.personName}
                        onChange={handleChange}
                        placeholder='Person Name'
                        className='placeholder:text-center mb-2 p-1 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                        type="tel"
                        name='phoneNumber'
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder='Phone Number'
                        className='placeholder:text-center mb-2 p-1  w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                        type="email"
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='Email Id'
                        className='placeholder:text-center mb-2 p-1  w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                        type="text"
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        placeholder='password'
                        className='placeholder:text-center mb-2 p-1  w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                        type="text"
                        name='companyName'
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder='Company Name'
                        className='placeholder:text-center mb-2 p-1  w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                        type="text"
                        name='address'
                        value={formData.address}
                        onChange={handleChange}
                        placeholder='Address'
                        className='placeholder:text-center mb-2 p-1  w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <div className='flex w-3/4 mb-2'>
                        <input
                            type="text"
                            name='dropinglocation'
                            value={formData.dropinglocation}
                            onChange={handleChange}
                            placeholder='Droping Location'
                            className='placeholder:text-center p-1 w-full border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <button type="button" onClick={addDroppingLocation} className='ml-2 px-4 py-1 bg-green-600 text-white rounded-3xl hover:bg-green-700 transition duration-300'>
                            Add
                        </button>
                    </div>
                    <div className='w-3/4 mb-4'>
                        {formData.dropingLocations.map((location, index) => (
                            <div key={index} className='flex justify-between items-center p-2 mb-2 border border-gray-300 rounded-3xl'>
                                <span>{location}</span>
                                <button onClick={() => removeDroppingLocation(index)} className='text-red-500'>
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className='w-3/4 mb-4'>
                        <button type="button" onClick={toggleCategoryModal} className='w-full px-4 py-2 bg-gray-400 text-white rounded-3xl cursor-pointer hover:bg-gray-500 transition duration-300'>
                            Select Categories
                        </button>
                        <div className='mt-2'>
                            {formData.categories.map((category) => (
                                <span key={category.cat_id} className='inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2'>{category.name}</span>
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
                        <button className='px-6 py-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition duration-300'>
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
                            <button onClick={toggleCategoryModal} className='text-red-500 text-xl'>&times;</button>
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
                                <label htmlFor={`category-${category.cat_id}`}>{category.name}</label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Sidebar>
    );
}
