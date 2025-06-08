import React, { useState, useEffect } from 'react';
import Sidebar from '../../component/Sidebar';
import userImage from '../../assets/user.webp';
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CategoryDetail(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const [hierarchical, setHierarchical] = React.useState([]);
    const { cat } = location.state || {};
    const { id } = useParams();
    const [data, setData] = useState({
        category: "",
        categoryId: "",
        subcategory: [],
        discription: "",
        imagePreview: "../.././assets/user.webp"
    });
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL+`/api/category/category/${id}`);
                setData({
                    category: res.data.data[0].cat_name,
                    discription: res.data.data[0].cat_description,
                    categoryId: res.data.data[0].cat_id,
                    imagePreview: res.data.data[0].cat_image ? `${import.meta.env.VITE_IMAGE_URL+res.data.data[0].cat_image}` :userImage,
                    subcategory: data.subcategory // Keep the existing subcategory array
                });

            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL+`/api/category/get-subcat/${id}`);
                setData((prev) => ({
                    ...prev,
                    subcategory: res.data.data || [] // Provide a default value of an empty array
                }));
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [id]);
    useEffect(() => {
        const fetchHierarchicalData = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL+`/api/category/hierarchical-cat/${id}`);
                setHierarchical(res.data.data || []); // Ensure hierarchical is set to an array
                
            } catch (err) {
                console.log(err);
            }
        };
        fetchHierarchicalData();
    }, [id]);
    

    const handleDelete = async () => {
        try {
            await axios.delete(import.meta.env.VITE_BACKEND_URL+`/api/category/delete-cat/${id}`);
            toast.warn("Category Deleted !")
            navigate('/dashboard/category/category');
        } catch (err) {
            console.log(err);
            toast.error("Failed to delete category.");
        }
    };
    // console.log(data)
    return (
        <Sidebar page={'Category'}>
            <div className='flex justify-end text-xl font-bold mt-5'>
                <button onClick={() => navigate('/dashboard/category/addcategory')} className="bg-green-700 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-3xl me-3">
                    + Add Category

                </button>
            </div>
            <div className='flex justify-start text-xl font-bold mt-5 ms-10'>
                <span className="text-green-400">{hierarchical?.map((item, index) => (
                    <React.Fragment key={item.cat_id}>
                        /
                        <Link to={`/dashboard/category/CategoryDetail/${item.cat_id}`}>{item.cat_name}</Link>
                        
                    </React.Fragment>
                ))}</span>
            </div>
            <div className='flex justify-center text-3xl font-bold mt-5 ms-10'>
                <span className="text-gray-400">Category Detail</span>
            </div>
            <div className='flex flex-col items-center h-4/6 w-4/5 mx-auto border-2 border-gray-400 rounded-3xl '>
                <img src={data.imagePreview} className='h-24 bg-cover mt-10 rounded-full' alt="User" />
                <div className='mt-10 w-full '>
                    <table className="table-auto border-collapse border border-white-400 w-full">
                        <tbody>
                            <tr>
                                <td className="border px-4 py-2 font-bold">Category:</td>
                                <td className="border px-4 py-2">{data.category}</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 font-bold">Category Id:</td>
                                <td className="border px-4 py-2">{data.categoryId}</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 font-bold">Sub Category:</td>
                                <td className="border px-4 py-2 text-blue-500">
                                    
                                    {data.subcategory.length>0?data.subcategory?.map((item, index) => (
                                        <React.Fragment key={item.cat_id}>
                                            <Link
                                                to={{
                                                    pathname: `/dashboard/category/CategoryDetail/${item.cat_id}`,
                                                    state: { cat: cat ? cat : '' + data.category + '/', cat_id: data.categoryId }
                                                }}
                                            >
                                                {item.cat_name}
                                            </Link>
                                            {index !== data.subcategory.length - 1 && ','}
                                        </React.Fragment>
                                    )):`NULL`}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 font-bold">Description:</td>
                                <td className="border px-4 py-2">{data.discription}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='my-auto '>
                    <button
                        onClick={() => navigate('/dashboard/category/addcategory', { state: { cat: cat ? cat : '' + data.category + '/', cat_id: data.categoryId } })}
                        className="bg-green-700 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-3xl me-3 w-52"
                    >
                        + Add SubCategory
                    </button>

                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-3xl m-4 w-52"
                        onClick={() => setIsDeleteConfirmOpen(true)}
                    >
                        Delete
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl m-4 w-52"
                        onClick={() => { navigate(`/dashboard/category/editcategory/${id}`) }}
                    >
                        Edit
                    </button>
                </div>
            </div>

            {isDeleteConfirmOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                        <p className="mb-4">Are you sure you want to delete this category?</p>
                        <div className="flex justify-end">
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                onClick={() => setIsDeleteConfirmOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Sidebar>
    );
}
