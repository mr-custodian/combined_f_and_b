import React, { useState } from 'react';
import Sidebar from '../../component/Sidebar';
import userImage from '../../assets/user.webp';
import { useLocation } from 'react-router-dom';

export default function AddSubCat() {
    const location =useLocation();
    const { cat,cat_id } = location.state || {};
    const [formData, setFormData] = useState({
        categoryName: "",
        categoryDescription: "",
        subcategory: "",
        imageFile: null,
        imagePreview: userImage
    });

    const subcategories = ["steel", "plastic"]; // Dummy data

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (event) => {
        const { files } = event.target;
        if (files.length > 0) {
            const file = files[0];
            setFormData((prev) => ({
                ...prev,
                imageFile: file,
                imagePreview: URL.createObjectURL(file)
            }));
        }
    };

    const handleClick = (event) => {
        event.preventDefault();
        console.log(formData);
    };

    return (
        <Sidebar page={"Category"}>
            <div className='flex justify-center text-3xl font-bold mt-5 ms-10'>
                <span className="text-gray-400">Add SubCategory</span>
            </div>
            <div className='flex justify-start text-xl font-bold mt-5 ms-10'>
                <span className="text-green-400">{cat}/</span>
            </div>
            <div className='flex flex-col items-center mt-10 p-6 h-auto w-4/5 mx-auto border-2 border-gray-300 shadow-lg rounded-3xl'>
                <div className='flex flex-col items-center mb-10'>
                    <img className='h-24 w-24 bg-cover rounded-full border-4 border-blue-500' src={formData.imagePreview} alt="Category" />
                    <label htmlFor="imageFile" className='mt-4 px-4 py-2 bg-gray-400 text-white rounded-3xl cursor-pointer hover:bg-gray-500 transition duration-300'>
                        Upload Image
                    </label>
                    <input type="file" id="imageFile" name="imageFile" accept="image/*" onChange={handleFileChange} className='hidden' />
                </div>

                <form className='flex flex-col items-center w-full'>
                    <input
                        type="text"
                        name='categoryName'
                        value={formData.categoryName}
                        onChange={handleChange}
                        placeholder='Category Name'
                        className='placeholder:text-center mb-4 p-3 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                        type="text"
                        name='categoryDescription'
                        value={formData.categoryDescription}
                        onChange={handleChange}
                        placeholder='Category Description'
                        className='placeholder:text-center mb-4 p-3 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                   
                    <div className='flex items-center'>
                        <button
                            onClick={handleClick}
                            className='px-6 py-2 mr-10 bg-green-600 text-white rounded-3xl hover:bg-green-700 transition duration-300'
                        >
                            Save
                        </button>
                        <button className='px-6 py-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition duration-300'>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </Sidebar>
    );
}
