import React from 'react';
import Sidebar from '../component/Sidebar';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the styles for react-toastify

const searchOptions = [
    { value: 'order_id', label: 'Order ID' },
    { value: 'category_name', label: 'Category Name' },
    { value: 'category_id', label: 'Category ID' },
    { value: 'supply_quantity', label: 'Supply Quantity' },
    { value: 'requirement_id', label: 'Requirement ID' },
    { value: 'supply_id', label: 'Supply ID' },
    { value: 'status', label: 'Status' },
];


export default function MainTable() {
    const [data, setData] = React.useState([]);
    const [requirementId, setRequirementId] = React.useState('');
    const [supplyId, setSupplyId] = React.useState('');
    const [quantity, setQuantity] = React.useState('');
    const [flag, setFlag] = React.useState(0);
    const [searchColumn, setSearchColumn] = React.useState('');
    const [searchTerm, setSearchTerm] = React.useState('');
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL+'/api/order/get-current-order');
                console.log(res);
                const fetchedData = res.data.data.map(item => ({
                    s_no: item.req_id,
                    order_id: item.order_id,
                    category_name: item.cat_name,
                    category_id: `CAT${item.list_cat_id}`,
                    supply_quantity: `${item.order_qty} kg`,
                    requirement_id: item.req_id,
                    supply_id: item.s_id,
                    status: item.order_status
                }));
                setData(fetchedData);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, [flag]);

    const handleSearch = () => {
        if (!searchTerm) return data;

        return data.filter((row) => {
            if (searchColumn) {
                return row[searchColumn]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
            } else {
                return Object.values(row).some(value =>
                    value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
        });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL+'/api/order/add-order', {
                req_id: requirementId,
                s_id: supplyId,
                quantity: quantity,
            });
            setFlag((prev) => prev + 1);
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error submitting data:', error);
            toast.error(error.response.data.error);
        }
    };

    return (
        <>
            <Sidebar page={'MainOrder Table'}>
                <div className='flex justify-around items-center mt-3'>
                    <input
                        type='text'
                        placeholder='Requirement ID'
                        value={requirementId}
                        onChange={(e) => setRequirementId(e.target.value)}
                        className='text-center w-1/4 p-1 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                        type='text'
                        placeholder='Supply ID'
                        value={supplyId}
                        onChange={(e) => setSupplyId(e.target.value)}
                        className='text-center w-1/4 p-1 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                        type='text'
                        placeholder='Quantity'
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className='text-center w-1/4 p-1 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <button
                        className='bg-slate-400 hover:bg-slate-600 box-border rounded-2xl p-1 border-1 text-white'
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>

                <div className='flex justify-around items-center mt-3'>
                    <select
                        className='text-center w-1/4 p-1 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={searchColumn}
                        onChange={(e) => setSearchColumn(e.target.value)}
                    >
                        <option value=''>All Columns</option>
                        {searchOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <input
                        type='text'
                        placeholder='Search...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='text-center w-1/4 p-1 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <button
                        className='bg-slate-400 hover:bg-slate-600 box-border rounded-2xl p-1 border-1 text-white'
                        onClick={() => setFlag((prev) => prev + 1)}
                    >
                        Search
                    </button>
                </div>
                <div className="mx-auto pt-10 container  overflow-auto">

                    <div className="min-w-full bg-white border border-gray-200 overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.no</th>
                                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category ID</th>
                                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supply Quantity</th>
                                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirement Id</th>
                                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supply Id</th>
                                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {handleSearch().map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="py-2 px-4">{index + 1}</td>
                                        <td className="py-2 px-4">{row.order_id}</td>
                                        <td className="py-2 px-4">{row.category_name}</td>
                                        <td className="py-2 px-4">{row.category_id}</td>
                                        <td className="py-2 px-4">{row.supply_quantity}</td>
                                        <td className="py-2 px-4">{row.requirement_id}</td>
                                        <td className="py-2 px-4">{row.supply_id}</td>
                                        <td className="py-2 px-4">{row.status}</td>
                                        <td className="py-2 px-4">
                                            <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => navigate(`/dashboard/order-mangagement/${row.order_id}`)}>
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Sidebar>
            <ToastContainer />
        </>
    );
}
