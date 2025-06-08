import React, { useState } from 'react';
import Sidebar from '../../component/Sidebar';
import userImage from '../../assets/user.webp';
import axios from 'axios';
import { useNavigate,useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
export default function AddCategory() {
    const [hierarchical, setHierarchical] = React.useState([]);
    const location =useLocation();
    const { cat,cat_id } = location.state || {};
    console.log(cat_id)
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        categoryName: "",
        categoryDescription: "",
        subcategory: "",
        imageFile: null,
        imagePreview: userImage,
        imageName:""
    });

   React.useEffect(() => {
        const fetchHierarchicalData = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL+`/api/category/hierarchical-cat/${cat_id}`);
                setHierarchical(res.data.data || []); // Ensure hierarchical is set to an array
                
            } catch (err) {
                console.log(err);
            }
        };
        fetchHierarchicalData();
    }, [cat_id]);

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

    const handleClick = async (event) => {
        event.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('categoryName',formData.categoryName)
        formDataToSend.append('categoryDescription',formData.categoryDescription)
        formDataToSend.append('imageFile',formData.imageFile)
        formDataToSend.append('parent',cat_id?cat_id:-1)
        try{
            const res =await axios.post(import.meta.env.VITE_BACKEND_URL+'/api/category/add',formDataToSend,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            });
            // console.log(res);
            toast.success("category created!")
            navigate('/dashboard/category/category');
        }catch(err)
        {
            console.log(err);
            toast.error("Duplicate Entry");
        }
        
        
    };

    return (
        <Sidebar page={"Category"}>
            <div className='flex justify-start text-xl font-bold mt-5 ms-10'>
                <span className="text-green-400">{hierarchical?.map((item, index) => (
                    <React.Fragment key={item.cat_id}>
                        /
                        {item.cat_name}
                        
                    </React.Fragment>
                ))}</span>
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
                        onClick={()=>{navigate('/dashboard/category/category')}}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </Sidebar>
    );
}
