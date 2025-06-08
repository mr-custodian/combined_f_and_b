import React, { useState, useEffect } from 'react';
import Sidebar from '../../component/Sidebar';
import userImage from '../../assets/user.webp';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function AddRequirement() {
    const [formData, setFormData] = useState({
        category: {},
        quantity: "",
        requirementId: "",
        price: "",
        amount: "",
        note: "",
        buyer: {},
        address: "",
        imageFile: null,
        imagePreview: userImage,
    });
    const [categories, setCategories] = useState([]);
    const [buyers, setBuyers] = useState([]);
    const [dropingAdd,setDropingAdd]= useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL+'/api/category/leaf-category');
                setCategories(res.data.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchBuyers = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL+'/api/buyer/allbuyer');
                setBuyers(res.data.data);
                // console.log(res.data.data)
            } catch (err) {
                console.log(err);
            }
        };
        fetchBuyers();
    }, []);

    useEffect(() => {
        if(formData.buyer.b_id)
        {
            const deliveryAdd = async()=>{
                try{
                    const res = await axios.get(import.meta.env.VITE_BACKEND_URL+`/api/buyer/getbuyer/${formData.buyer.b_id}`);
                    setDropingAdd(res.data.dropingaddress)
                    // console.log(res.data.dropingaddress)
                }catch(err)
                {
                    console.log(err);
                }
            }
            deliveryAdd()
        }
    }, [formData.buyer]);

    useEffect(() => {
        if (formData.quantity && formData.price) {
            const amount = parseFloat(formData.quantity) * parseFloat(formData.price);
            setFormData(prev => ({ ...prev, amount: amount.toFixed(2) }));
        }
    }, [formData.quantity, formData.price]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        
        if (name === 'buyer' || name === 'category') {
            try {
                const parsedValue = value ? JSON.parse(value) : {};
                if (name === 'buyer') {
                    setFormData(prev => ({
                        ...prev,
                        buyer: parsedValue,
                        address: parsedValue.b_address || ''
                    }));
                } else if (name === 'category') {
                    setFormData(prev => ({
                        ...prev,
                        category: parsedValue
                    }));
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    

    // console.log(formData.category.cat_image)

    const handleClick = async (event) => {
        event.preventDefault();
        
        const data = {
            req_quantity: formData.quantity,
            req_price: formData.price,
            req_status: "Pending",
            req_note: formData.note,
            b_id: formData.buyer.b_id,
            b_name: formData.buyer.b_name,
            b_add: formData.buyer.b_address,
            b_drop_add: formData.address,
            b_moile: formData.buyer.b_mobile,  // Corrected typo
            list_cat_id: formData.category.cat_id,
            cat_name: formData.category.cat_name,
            cat_image: formData.category.cat_image
        };
    
        // Debug: Check the contents of the data object
        // console.log(data);
    
        try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL+'/api/requirement/add-requirement', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // console.log(response.data);
            toast.success('Requirement Added!')
            navigate('/dashboard/requirement/allrequirement')
        } catch (error) {
            toast.error(error.response.data.message)
            console.error('Error adding requirement:', error);
        }
    };
    
    
   
    
    return (
        <Sidebar page={"Requirement Adding"}>
            <div className='flex flex-col items-center mt-10 p-6 h-auto w-4/5 mx-auto border-2 border-gray-300 shadow-lg rounded-3xl'>
                <div className='flex flex-col items-center mb-10'>
                    <img className='h-24 w-24 bg-cover rounded-full border-4 border-blue-500' src={formData.category.cat_image?`${import.meta.env.VITE_IMAGE_URL+formData.category.cat_image}`:userImage} alt="User" />
                </div>

                <form className='flex flex-col items-center w-full'>
                <div className='w-full flex justify-between'>
                <label className='text-right pr-4'>Select Category : </label>
                    <select
                        name='category'
                        value={JSON.stringify(formData.category)}
                        onChange={handleChange}
                        className='placeholder:text-center mb-4 p-1 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                        <option value="" >Select Category</option>
                        {categories.map((category, index) => (
                            <option key={index} value={JSON.stringify(category)}>{category.cat_name}</option>
                        ))}
                    </select>
                    </div>  
                    <div className='w-full flex justify-between'>
                    <label className='text-right pr-4'>Category Name : </label>
                    <input
                        type="text"
                        name='categoryName'
                        value={formData.category.cat_id || ''}
                        placeholder='Category Name'
                        readOnly
                        className='placeholder:text-center mb-4 p-1 w-3/4 border border-gray-300 rounded-3xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    </div>
                    <div className='w-full flex justify-between'>
                    <label className='text-right pr-4'>Quantity : </label>
                    <input
                        type="text"
                        name='quantity'
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder='Quantity'
                        className='placeholder:text-center mb-4 p-1 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    </div>
                    <div className='w-full flex justify-between'>
                    <label className='text-right pr-4'>Price : </label>
                    <input
                        type="text"
                        name='price'
                        value={formData.price}
                        onChange={handleChange}
                        placeholder='Price'
                        className='placeholder:text-center mb-4 p-1 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    </div>
                    <div className='w-full flex justify-between'>
                    <label className='text-right pr-4'>Amount : </label>
                    <input
                        type="text"
                        name='amount'
                        value={formData.amount}
                        placeholder='Amount'
                        readOnly
                        className='placeholder:text-center mb-4 p-1 w-3/4 border border-gray-300 rounded-3xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    </div>
                    <div className='w-full flex justify-between'>
                    <label className='text-right pr-4'>Note : </label>
                    <input
                        type="text"
                        name='note'
                        value={formData.note}
                        onChange={handleChange}
                        placeholder='Note'
                        className='placeholder:text-center mb-4 p-1 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-red-500'
                    />
                    </div>
                    <div className='w-full flex justify-between'>
                    <label className='text-right pr-4'>Select Buyer : </label>
                    <select
                        name='buyer'
                        value={JSON.stringify(formData.buyer)}
                        onChange={handleChange}
                        className='placeholder:text-center mb-4 p-1 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                        <option value="" >Select Buyer</option>
                        {buyers.map((buyer, index) => (
                            <option key={index} value={JSON.stringify(buyer)}>{buyer.b_name}</option>
                        ))}
                    </select>
                    </div>
                    <div className='w-full flex justify-between'>
                    <label className='text-right pr-4'>Select Droping Address : </label>
                    <select
                        name='address'
                        value={formData.address}
                        onChange={handleChange}
                        className='placeholder:text-center mb-4 p-1 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                        <option value="" >Select Droping Address</option>
                        {dropingAdd.map((add, index) => (
                            <option key={index} value={add.dropingAddress}>{add.dropingAddress}</option>
                        ))}
                    </select>
                    </div>
                    
                    <div className='flex items-center'>
                        <button
                            onClick={handleClick}
                            className='px-6 py-2 mr-10 bg-green-600 text-white rounded-3xl hover:bg-green-700 transition duration-300  w-32'
                        >
                            Save
                        </button>
                        <button className='px-6 py-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition duration-300 w-32'
                        onClick={()=>{navigate('/dashboard/requirement/allrequirement')}}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
           
        </Sidebar>
    );
}
