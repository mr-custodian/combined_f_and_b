import React, { useState } from 'react';
import Sidebar from '../../component/Sidebar';
import userImage from '../../assets/user.webp';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
export default function Editcategory() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        categoryName: "",
        categoryDescription: "",
        subcategory: "",
        parent: '',
        imageFile: null,
        imagePreview: userImage,
        imageName: ""
    });


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
                imageFile: file,

                imageName: name === 'imageFile' ? file.name : prev.imageName,
                imagePreview: URL.createObjectURL(file)
            }));
        }
    };
    React.useEffect(() => {
        try {
            const fetchData = async () => {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL+`/api/category/category/${id}`);
                console.log(res.data.data[0]);
                setFormData({
                    categoryName: res.data.data[0].cat_name,
                    categoryDescription: res.data.data[0].cat_description,
                    imagePreview: `${import.meta.env.VITE_IMAGE_URL + res.data.data[0].cat_image}`,
                    imageName: res.data.data[0].cat_image,
                    parent: res.data.data[0].parent

                })
                // console.log(formData)
            }
            fetchData();
        } catch (err) {
            console.log(err);
        }
    }, [])
    const handleClick = async (event) => {
        event.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('categoryName', formData.categoryName)
        formDataToSend.append('categoryDescription', formData.categoryDescription)
        formDataToSend.append('imageName', formData.imageName)
        formDataToSend.append('parent', formData.parent)
        if (formData.imageFile) {
            formDataToSend.append('imageFile', formData.imageFile)
        }
        try {
            const res = await axios.put(import.meta.env.VITE_BACKEND_URL+`/api/category/edit/${id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("category updated!")
            navigate(`/dashboard/category/editcategory/${id}`);
        } catch (err) {
            console.log(err);
            toast.error("Duplicate Entry");
        }


    };

    return (
        <Sidebar page={"Category"}>
            <div className='flex flex-col items-center mt-10 p-6 h-auto w-4/5 mx-auto border-2 border-gray-300 shadow-lg rounded-3xl'>
                <div className='flex flex-col items-center mb-10'>
                    <img className='h-24 w-24 bg-cover rounded-full border-4 border-blue-500' src={formData.imageName ? formData.imagePreview : userImage} alt="Category" />
                    <label htmlFor="imageFile" className='mt-4 px-4 py-2 bg-gray-400 text-white rounded-3xl cursor-pointer hover:bg-gray-500 transition duration-300'>
                        Upload Image
                    </label>
                    <input type="file" id="imageFile" name="imageFile" accept="image/*" onChange={handleFileChange} className='hidden' />
                </div>

                <form className='flex flex-col items-center w-full'>
                <div className='flex items-center w-3/4 mb-4'>
        <label htmlFor='categoryName' className='w-1/4 text-right mr-4'>Category Name</label>
        <input
            type="text"
            name='categoryName'
            id='categoryName'
            value={formData.categoryName}
            onChange={handleChange}
            className='p-3 w-full border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
    </div>

    <div className='flex items-center w-3/4 mb-4'>
        <label htmlFor='categoryDescription' className='w-1/4 text-right mr-4'>Category Description</label>
        <input
            type="text"
            name='categoryDescription'
            id='categoryDescription'
            value={formData.categoryDescription}
            onChange={handleChange}
            className='p-3 w-full border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
    </div>
                    {/* <select
                        name='subcategory'
                        value={formData.subcategory}
                        onChange={handleChange}
                        className='placeholder:text-center mb-4 p-3 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                        <option value="" disabled>Select Subcategory</option>
                        {subcategories.map((subcategory, index) => (
                            <option key={index} value={subcategory}>{subcategory}</option>
                        ))}
                    </select> */}
                    <div className='flex items-center'>
                        <button
                            onClick={handleClick}
                            className='px-6 py-2 mr-10 bg-green-600 text-white rounded-3xl hover:bg-green-700 transition duration-300'
                        >
                            Save
                        </button>
                        <button className='px-6 py-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition duration-300'
                            onClick={() => { navigate(`/dashboard/category/CategoryDetail/${id}`) }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </Sidebar>
    );
}
