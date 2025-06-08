import React, { useState } from 'react';
import Sidebar from '../../component/Sidebar';
import userImage from '../.././assets/user.webp';
import { Link, useParams ,useNavigate} from 'react-router-dom';
import axios from 'axios';
import { parseISO, format } from 'date-fns';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RequirementDetail() {
    const [data, setData] = useState({});
    const navigate = useNavigate();
    const id = useParams().id;
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    // Example data
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL+`/api/requirement/requirement-detail/${id}`);
                setData(res.data.results[0]);
                console.log(res.data.results[0])
            } catch (err) {
                console.log(err);
            }

        }
        fetchData();
    }, [])
    // Example addresses
    const handleDelete = async () => {
        try {
            await axios.delete(import.meta.env.VITE_BACKEND_URL+`/api/requirement/delete/${id}`);
            toast.warn('Requirement Deleted!')
            navigate('/dashboard/requirement/allrequirement');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Sidebar page={'Requirement'}>
            <div className='flex justify-end text-xl font-bold mt-5'>
                <Link to='/dashboard/requirement/addrequirement' className="bg-green-700 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-3xl me-3">
                    + Add Requirement
                </Link>
            </div>
            <div className='flex justify-center text-3xl font-bold mt-5 ms-10'>
                <span className="text-gray-400">Profile</span>
            </div>
            <div className='flex flex-col items-center h-4/6 w-4/5 mx-auto border-2 border-gray-400 rounded-3xl'>
                <img src={data.cat_image?import.meta.env.VITE_IMAGE_URL + data.cat_image:userImage
                } className='h-24  bg-cover mt-10 rounded-full' alt="User" />
                <div className='mt-10 w-full'>
                    <table className="table-auto border-collapse border border-white-400 w-full">
                        <tbody>
                            <tr>
                                <td className="border px-4  font-bold">Category Name:</td>
                                <td className="border px-4 ">{data.cat_name}</td>
                            </tr>
                            <tr>
                                <td className="border px-4  font-bold">Category ID:</td>
                                <td className="border px-4 ">{data.list_cat_id
                                }</td>
                            </tr>
                            <tr>
                                <td className="border px-4  font-bold">Quantity ::</td>
                                <td className="border px-4 p">{data.req_quantity} Kg</td>
                            </tr>
                            <tr>
                                <td className="border px-4  font-bold">Requirement ID:</td>
                                <td className="border px-4 ">{data.req_id
                                }</td>
                            </tr>
                            <tr>
                                <td className="border px-4  font-bold">Price:</td>
                                <td className="border px-4 ">{data.req_price} Rs</td>
                            </tr>
                            <tr>
                                <td className="border px-4  font-bold">Amount :</td>
                                <td className="border px-4 ">{data.req_price * data.req_quantity} Rs</td>
                            </tr>
                            <tr>
                                <td className="border px-4  font-bold">Date :</td>
                                <td className="border px-4 ">{format(parseISO(data.create_at ? data.create_at :
                                    "2024-09-13T00:17:19.000Z"), 'MM/dd/yy')}</td>
                            </tr>
                            <tr>
                                <td className="border px-4  font-bold">Note :</td>
                                <td className="border px-4 ">{data.req_note}</td>

                            </tr>
                            <tr>
                                <td className="border px-4  font-bold">Buyer’s Name :</td>
                                <td className="border px-4 ">{data.b_name
                                }</td>
                            </tr>
                            <tr>
                                <td className="border px-4  font-bold">Buyer’s Phone No. : </td>
                                <td className="border px-4 ">{data.b_moile}</td>
                            </tr>
                            <tr>
                                <td className="border px-4 font-bold">Buyer’s Address : </td>
                                <td className="border px-4">{data.b_add
                                }</td>
                            </tr>
                            <tr>
                                <td className="border px-4 font-bold">Order drop location :</td>
                                <td className="border px-4">{data.b_drop_add
                                }</td>
                            </tr>
                            <tr>
                                <td className="border px-4 font-bold">Status :</td>
                                <td className="border px-4">{data.req_status
                                }</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
                <div className='my-auto '>
                <button
                        className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-3xl m-4 w-32`}
                        onClick={() => setIsDeleteConfirmOpen(true)}
                    >
                        Delete
                    </button>
                    <button
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl m-4 w-32`}
                        onClick={()=>{navigate(`/dashboard/requirement/editRequirement/${id}`)}}
                    >
                        Edit
                    </button>
                    <button
                        className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-3xl m-4 w-32`}
                        onClick={()=>{navigate('/dashboard/requirement/allrequirement')}}
                    >
                        Back
                    </button>

                </div>
            </div>

            {isDeleteConfirmOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                        <p className="mb-4">Are you sure you want to delete this buyer?</p>
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
