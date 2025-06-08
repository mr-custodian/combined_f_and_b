import React, { useEffect, useState } from 'react';
import Sidebar from '../component/Sidebar';
import userImage from '../assets/user.webp';
import axios from 'axios';
import { useNavigate ,useParams} from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function AddVendor() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        personName: "",
        password: "",
        phoneNumber: "",
        email: "",
        companyName: "",
        address: "",
        category: [],
        pdfFile: null,
        imageFile: null,
        imagePreview: userImage,
        pdfFileName: "",
        imageName:"",
        pdfFileUrl: ""
    });
    const [data, setData] = useState({});
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);

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
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL+`/api/vendor/vender-detail/${id}`);
                setData(res.data.data);
                console.log(res.data.data)
                // console.log(res.data.data)
                // setCategories(res.data.category);
                setFormData((prev)=>{
                    return {
                        ...prev,
                        imagePreview:`${import.meta.env.VITE_IMAGE_URL+res.data.data.v_image}`,
                        pdfFileUrl:`${import.meta.env.VITE_IMAGE_URL+res.data.data.v_document}`,
                        pdfFileName:res.data.data.v_document,
                        imageName:res.data.data.v_image,
                        personName:res.data.data.v_name,
                        phoneNumber:res.data.data.v_mobile,
                        email:res.data.data.v_email,
                        password:res.data.data.v_password,
                        companyName:res.data.data.v_companyname,
                        address:res.data.data.v_address,
                        category:res.data.category.map(item => item.cat_id)
    

                        
                    }
                })

            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [id]);
    // console.log(formData.category)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL+'/api/category/categories');
                setCategories(res.data.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, []);

    const handleFileChange = (event) => {
        const { name, files } = event.target;
        if (files.length > 0) {
            const file = files[0];
            setFormData((prev) => ({
                ...prev,
                [name]: file,
                imagePreview: name === 'imageFile' ? URL.createObjectURL(file) : prev.imagePreview,
                pdfFileName: name === 'pdfFile' ? file.name : prev.pdfFileName,
                imageName:name === 'imageFile' ? file.name : prev.imageName,
                pdfFileUrl: name === 'pdfFile' ? URL.createObjectURL(file) : prev.pdfFileUrl
            }));
        }
    };

    const handleCategoryChange = (categoryId) => {
        setFormData((prev) => {
            const updatedCategories = prev.category.includes(categoryId)
                ? prev.category.filter((id) => id !== categoryId)
                : [...prev.category, categoryId];
            return {
                ...prev,
                category: updatedCategories
            };
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('personName', formData.personName);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('phoneNumber', formData.phoneNumber);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('category', JSON.stringify(formData.category));
        formDataToSend.append('companyName', formData.companyName);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('imageName', formData.imageName);
        formDataToSend.append('pdfFileName', formData.pdfFileName);

        if (formData.imageFile) {
            formDataToSend.append('imageFile', formData.imageFile);
        }
        if (formData.pdfFile) {
            formDataToSend.append('pdfFile', formData.pdfFile);
        }

        try {
            const res = await axios.put(import.meta.env.VITE_BACKEND_URL+`/api/vendor/edit/${id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Vendor detail updated! ")
            navigate('/dashboard/vendor/vendors');
        } catch (err) {
            toast.error(err.response.data.message)
            console.error(err);
        }
    };

    const toggleCategoryModal = () => {
        setIsCategoryModalOpen(!isCategoryModalOpen);
    };

    const togglePdfModal = () => {
        setIsPdfModalOpen(!isPdfModalOpen);
    };

    return (
        <Sidebar page={"Vendor"}>
            <div className='flex flex-col items-center mt-10 p-6 h-auto w-4/5 mx-auto border-2 border-gray-300 shadow-lg rounded-3xl'>
                <div className='flex flex-col items-center mb-10'>
                    <img className='h-24 w-24 bg-cover rounded-full border-4 border-blue-500' src={formData.imageName?formData.imagePreview:userImage} alt="User" />
                    <label htmlFor="imageFile" className='mt-4 px-4 py-2 bg-gray-400 text-white rounded-3xl cursor-pointer hover:bg-gray-500 transition duration-300'>
                        Upload Image
                    </label>
                    <input type="file" id="imageFile" name="imageFile" accept="image/*" onChange={handleFileChange} className='hidden' />
                </div>

                <form className='flex flex-col items-center w-full' onSubmit={handleSubmit}>
                <div className='flex flex-row items-center mb-4 w-3/4'>
        <label htmlFor='personName' className='mr-4 w-1/4 text-right'>
            Person Name:
        </label>
        <input
            type="text"
            name='personName'
            value={formData.personName}
            onChange={handleChange}
            id='personName'
            className='placeholder:text-center p-2 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
            maxLength="30"
        />
    </div>

    <div className='flex flex-row items-center mb-4 w-3/4'>
        <label htmlFor='phoneNumber' className='mr-4 w-1/4 text-right'>
            Phone Number:
        </label>
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

    <div className='flex flex-row items-center mb-4 w-3/4'>
        <label htmlFor='email' className='mr-4 w-1/4 text-right'>
            Email:
        </label>
        <input
            type="email"
            name='email'
            value={formData.email}
            onChange={handleChange}
            id='email'
            className='placeholder:text-center p-2 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
    </div>

    <div className='flex flex-row items-center mb-4 w-3/4'>
        <label htmlFor='password' className='mr-4 w-1/4 text-right'>
            Password:
        </label>
        <input
            type="text"
            name='password'
            value={formData.password}
            onChange={handleChange}
            id='password'
            className='placeholder:text-center p-2 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
    </div>

    <div className='flex flex-row items-center mb-4 w-3/4'>
        <label htmlFor='companyName' className='mr-4 w-1/4 text-right'>
            Company Name:
        </label>
        <input
            type="text"
            name='companyName'
            value={formData.companyName}
            onChange={handleChange}
            id='companyName'
            className='placeholder:text-center p-2 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
    </div>

    <div className='flex flex-row items-center mb-4 w-3/4'>
        <label htmlFor='address' className='mr-4 w-1/4 text-right'>
            Address:
        </label>
        <input
            type="text"
            name='address'
            value={formData.address}
            onChange={handleChange}
            id='address'
            className='placeholder:text-center p-2 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
    </div>
                    <div className='mb-4 w-3/4 flex justify-between items-center'>
                        <button
                            type="button"
                            onClick={toggleCategoryModal}
                            className='px-4 py-2 bg-gray-400 text-white rounded-3xl cursor-pointer hover:bg-gray-500 transition duration-300'
                        >
                            Select Categories
                        </button>
                        <label htmlFor="pdfFile" className='px-4 py-2 bg-gray-400 text-white rounded-3xl cursor-pointer hover:bg-gray-500 transition duration-300'>
                            Upload Document
                        </label>
                        <input type="file" id="pdfFile" name="pdfFile" accept="application/pdf" onChange={handleFileChange} className='hidden' />
                    </div>
                    <div className='mb-4 w-3/4 flex flex-wrap'>
                        {formData.category.map((catId, index) => (
                            <span key={index} className='mr-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full'>
                                {categories.find(cat => cat.cat_id === catId)?.cat_name}
                            </span>
                        ))}
                    </div>
                    {(data.v_document ||formData.pdfFileName )&&<p className='mb-4 cursor-pointer text-blue-500' onClick={togglePdfModal}>Uploaded PDF: {formData.pdfFileName}</p>}
                    <div className='flex items-center'>
                        <button
                            type="submit"
                            className='px-6 py-2 mr-10 bg-green-600 text-white rounded-3xl hover:bg-green-700 transition duration-300'
                        >
                            Submit
                        </button>
                        <button className='px-6 py-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition duration-300'
                        onClick={()=>{navigate('/dashboard/vendor/vendors')}}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
            
            {isCategoryModalOpen && (
                <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50'>
                    <div className='bg-white p-6 rounded-lg shadow-lg w-4/5 h-4/5 overflow-auto'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-bold'>Select Categories</h2>
                            <button onClick={toggleCategoryModal} className='text-red-500 text-xl'>&times;</button>
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            {categories.map((category) => (
                                <div key={category.cat_id} className='flex items-center'>
                                    <input
                                        type="checkbox"
                                        id={`category-${category.cat_id}`}
                                        checked={formData.category.includes(category.cat_id)}
                                        onChange={() => handleCategoryChange(category.cat_id)}
                                    />
                                    <label htmlFor={`category-${category.cat_id}`} className='ml-2'>{category.cat_name}</label>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={toggleCategoryModal}
                            className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-700 transition duration-300'
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}

            {isPdfModalOpen && (
                <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50'>
                    <div className='bg-white p-6 rounded-lg shadow-lg w-4/5 h-4/5'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-bold'>Uploaded Document</h2>
                            <button onClick={togglePdfModal} className='text-red-500 text-xl'>&times;</button>
                        </div>
                        <iframe src={formData.pdfFileUrl} className='w-full h-full border'></iframe>
                    </div>
                </div>
            )}
        </Sidebar>
    );
}
