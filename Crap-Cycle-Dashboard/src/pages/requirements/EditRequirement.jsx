import React, { useState, useEffect } from 'react';
import Sidebar from '../../component/Sidebar';
import userImage from '../../assets/user.webp';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function AddRequirement() {
    const Id = useParams().id;
    const [formData, setFormData] = useState({
        category: {},
        quantity: "",
        requirementId: "",
        price: "",
        amount: "",
        note: "",
        buyer: {},
        address: ""
    });
    const [categories, setCategories] = useState([]);
    const [buyers, setBuyers] = useState([]);
    const [dropingAdd, setDropingAdd] = useState([]);

    const navigate = useNavigate();


    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL+`/api/requirement/requirement-detail/${Id}`);
                setFormData({
                    category: {
                        cat_id: res.data.results[0].list_cat_id,
                        cat_image: res.data.results[0].cat_image,
                        cat_name: res.data.results[0].cat_name,

                    },
                    buyer: {
                        b_id: res.data.results[0].b_id,
                        b_mobile: res.data.results[0].b_moile,
                        b_drop_add: res.data.results[0].b_drop_add,
                        b_name: res.data.results[0].b_name,
                        b_address: res.data.results[0].b_add,
                    },
                    quantity: res.data.results[0].req_quantity,
                    price: res.data.results[0].req_price,
                    address: res.data.results[0].b_drop_add,
                    note: res.data.results[0].req_note,
                });
                console.log(res.data.results[0])
            } catch (err) {
                console.log(err);
            }

        }
        fetchData();
    }, [Id])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL+'/api/category/categories');
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
                // console.log(res.data.data[0])
            } catch (err) {
                console.log(err);
            }
        };
        fetchBuyers();
    }, []);

    useEffect(() => {
        if (formData.buyer.b_id) {
            const deliveryAdd = async () => {
                try {
                    const res = await axios.get(import.meta.env.VITE_BACKEND_URL+`/api/buyer/getbuyer/${formData.buyer.b_id}`);
                    setDropingAdd(res.data.dropingaddress)
                } catch (err) {
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
        if (name === 'buyer') {
            const buyer = JSON.parse(value);
            setFormData((prev) => ({
                ...prev,
                buyer: buyer,
                address: buyer.b_address
            }));
        } else if (name === 'category') {
            setFormData((prev) => ({
                ...prev,
                category: JSON.parse(value)
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };


    const handleClick = async (event) => {
        event.preventDefault();

        const data = {
            req_quantity: formData.quantity,
            req_price: formData.price,
            req_status: "pending",
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
        console.log(data);

        try {
            const response = await axios.put(import.meta.env.VITE_BACKEND_URL+`/api/requirement/edit/${Id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // console.log(response.data);
            toast.success('requirement Detailed Updated!');
            navigate(`/dashboard/requirement/detail/${Id}`)
        } catch (error) {
            console.error('Error adding requirement:', error);
            toast.error(error.response.data.message);
        }
    };



    return (
        <Sidebar page={"Requirement Adding"}>
            <div className='flex flex-col items-center mt-10 p-6 h-auto w-4/5 mx-auto border-2 border-gray-300 shadow-lg rounded-3xl'>
                <div className='flex flex-col items-center mb-10'>
                    <img className='h-24 w-24 bg-cover rounded-full border-4 border-blue-500' src={formData.category.cat_image ? `${import.meta.env.VITE_IMAGE_URL + formData.category.cat_image}` : userImage} alt="User" />

                </div>

                <form className='flex flex-col items-center w-full'>
                    <select
                        name='category'
                        value={JSON.stringify(formData.category)}
                        onChange={handleChange}
                        className='placeholder:text-center mb-4 p-1 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                        <option value="" disabled>Select Category</option>
                        {categories.map((category, index) => (
                            <option key={index} value={JSON.stringify(category)}>{category.cat_name}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        name='categoryName'
                        value={formData.category.cat_id || ''}
                        placeholder='Category Name'
                        readOnly
                        className='placeholder:text-center mb-4 p-1 w-3/4 border border-gray-300 rounded-3xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                        type="text"
                        name='quantity'
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder='Quantity'
                        className='placeholder:text-center mb-4 p-1 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                        type="text"
                        name='price'
                        value={formData.price}
                        onChange={handleChange}
                        placeholder='Price'
                        className='placeholder:text-center mb-4 p-1 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                        type="text"
                        name='amount'
                        value={formData.amount}
                        placeholder='Amount'
                        readOnly
                        className='placeholder:text-center mb-4 p-1 w-3/4 border border-gray-300 rounded-3xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                        type="text"
                        name='note'
                        value={formData.note}
                        onChange={handleChange}
                        placeholder='Note'
                        className='placeholder:text-center mb-4 p-1 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-red-500'
                    />
                    <select
                        name='buyer'
                        value={JSON.stringify(formData.buyer)}
                        onChange={handleChange}
                        className='placeholder:text-center mb-4 p-1 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                        <option value="" disabled>Select Buyer</option>
                        {buyers.map((buyer, index) => (
                            <option key={index} value={JSON.stringify(buyer)}>{buyer.b_name}</option>
                        ))}
                    </select>
                    <select
                        name='address'
                        value={formData.address}
                        onChange={handleChange}
                        className='placeholder:text-center mb-4 p-1 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                        <option value="" disabled>Select Buyer</option>
                        {dropingAdd.map((add, index) => (
                            <option key={index} value={add.dropingAddress}>{add.dropingAddress}</option>
                        ))}
                    </select>

                    <div className='flex items-center'>
                        <button
                            onClick={handleClick}
                            className='px-6 py-2 mr-10 bg-green-600 text-white rounded-3xl hover:bg-green-700 transition duration-300 w-32'
                        >
                            Save
                        </button>
                        <button className='px-6 py-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition duration-300 w-32'
                            onClick={() => {
                                navigate(`/dashboard/requirement/detail/${Id}`)
                            }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

        </Sidebar>
    );
}
