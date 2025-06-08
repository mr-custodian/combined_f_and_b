import React from 'react';
import Sidebar from '../component/Sidebar';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for styling

const searchOptions = ['requirement_id', 'category_name', 'category_id'];

export default function SpecificMainTable() {
    const [data, setData] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchColumn, setSearchColumn] = React.useState('');
    const [requirementId, setRequirementId] = React.useState('');
    const [supplyId, setSupplyId] = React.useState('');
    const [quantity, setQuantity] = React.useState('');
    const [flag, setFlag] = React.useState(0);
    const navigate = useNavigate();
    const { req_id } = useParams();

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL+`/api/order/get-requirement-order/${req_id}`);
                console.log(res);
                const fetchedData = res.data.data.map(item => ({
                    s_no: item.req_id,
                    order_id: `OR${item.order_id}`,
                    category_name: item.cat_name,
                    category_id: `CAT${item.list_cat_id}`,
                    supply_quantity: `${item.order_qty} kg`,
                    requirement_id: item.req_id,
                    supply_id: item.s_id,
                    status: item.order_status
                }));
                setData(fetchedData);
            } catch (err) {
                console.error('Error fetching data:', err);
                toast.error('Failed to fetch data');
            }
        };

        fetchData();
    }, [req_id, flag]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchColumnChange = (event) => {
        setSearchColumn(event.target.value);
    };

    const handleSearchClick = () => {
        if (searchColumn) {
            const filteredData = data.filter(item =>
                item[searchColumn].toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
            setData(filteredData);
        }
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
            <Sidebar page={'Requirement Table'}>
                <div className='flex justify-around items-center mt-5'>
                    <button
                        className='bg-white text-black px-4 py-2 rounded border-2 border-gray-300 hover:bg-gray-200 hover:border-gray-400 transition-all duration-200 ease-in-out'
                        onClick={() => navigate('/dashboard/requirement/allrequirement')}
                    >
                        Requirement Table
                    </button>
                    <button
                        className='bg-white text-black px-4 py-2 rounded border-2 border-gray-300 hover:bg-gray-200 hover:border-gray-400 transition-all duration-200 ease-in-out'
                        onClick={() => navigate('/supplytable')}
                    >
                        Supply Table
                    </button>
                    <button
                        className='bg-white text-black px-4 py-2 rounded border-2 border-gray-300 hover:bg-gray-200 hover:border-gray-400 transition-all duration-200 ease-in-out'
                        onClick={() => navigate('/dashboard/maintable')}
                    >
                        Main Table
                    </button>
                </div>
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

                <div className="mx-auto pt-10 container w-screen">
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
                            {data.map((row, index) => (
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
                                        <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => navigate('/supplytable')}>
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Sidebar>
            <ToastContainer />
        </>
    );
}
