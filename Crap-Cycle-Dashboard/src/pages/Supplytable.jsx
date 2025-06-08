import React, { useEffect } from 'react';
import Sidebar from '../component/Sidebar';
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';

const sortByOptions = ['vendor_name', 'cat_id', 'cat_name', 's_id', 'supply_quantity', 'supply_rate', 'v_id', 'vendor_supply'];
const searchOptions = ['vendor_name', 'cat_id', 'cat_name', 's_id', 'supply_quantity', 'supply_rate', 'v_id', 'vendor_supply'];

export default function SupplyTable() {
    const [data, setData] = React.useState([]);
    const [sortby, setSortBy] = React.useState('');
    const [ascending, setAscending] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchColumn, setSearchColumn] = React.useState('');
    const [notification, setNotification] = React.useState('');
    const [filteredData, setFilteredData] = React.useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/supply/pending-supply');

                const fetchedData = res.data.results.map(item => ({
                    s_id: item.s_id,
                    v_id: item.v_id,
                    cat_id: item.list_cat_id,
                    cat_name: item.cat_name,
                    id: item.id,
                    vendor_name: item.v_name,
                    supply_quantity: item.s_qty,
                    supply_rate: item.s_price,
                    status: item.s_status,
                    asked_price: '',
                    lower_limit: '',
                    upper_limit: '',
                    asked_quantity: '',
                    vendor_supply: item.vendor_supply
                }));

                setData(fetchedData);
                setFilteredData(fetchedData);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleSortClick = () => {
        const sortedData = [...filteredData].sort((a, b) => {
            if (sortby) {
                if (ascending) {
                    return a[sortby] > b[sortby] ? 1 : -1;
                } else {
                    return a[sortby] < b[sortby] ? 1 : -1;
                }
            }
            return 0;
        });
        setFilteredData(sortedData);
        setAscending(!ascending);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchColumnChange = (event) => {
        setSearchColumn(event.target.value);
    };

    const handleSearchClick = () => {
        if (searchColumn && searchTerm) {
            const filteredData = data.filter(item =>
                item[searchColumn].toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredData(filteredData);
        } else {
            setFilteredData(data);
        }
    };

    const updateDataValue = (index, key, value) => {
        const updatedData = [...data];
        updatedData[index][key] = value;
        setData(updatedData);
        setFilteredData(updatedData);
    };

    const handleLowerLimitChange = (index, value) => {
        updateDataValue(index, 'lower_limit', value);
    };

    const handleUpperLimitChange = (index, value) => {
        updateDataValue(index, 'upper_limit', value);
    };

    const handleAskedQuantityChange = (index, value) => {
        updateDataValue(index, 'asked_quantity', value);
    };

    const handleBellClick = async (item) => {

        if (item.lower_limit <= 0 && item.upper_limit <= 0 && item.asked_quantity ) {
            toast.error("Selling Quantity and Selling Price must be positive values");
            return;
          }
        const notificationData = {
            s_id: item.s_id,
            v_id: item.v_id,
            asked_price: `${item.lower_limit}-${item.upper_limit}`,
            asked_quantity: item.asked_quantity,
            prev_price: item.supply_rate,
            prev_quantity: item.supply_quantity,
            cat_id: item.cat_id,
            cat_name: item.cat_name,
            lower_price: item.lower_limit,
            upper_price: item.upper_limit
        };

        try {
            const res = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/notification/new-notification', notificationData);
            setNotification('Notification sent successfully!');
            setTimeout(() => setNotification(''), 3000);
        } catch (err) {
            console.log(err);
            setNotification('Failed to send notification.');
            setTimeout(() => setNotification(''), 3000);
        }
    };

    return (
        <>
            <Sidebar page={'Supply Table'}>
                <ToastContainer/>
                <div className='flex justify-around items-center mt-3'>
                    <select
                        name='sortby'
                        onChange={handleSortChange}
                        value={sortby}
                        className='text-center w-1/4 p-1 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                        <option value="" disabled>Sort By</option>
                        {sortByOptions.map((item, index) => (
                            <option key={index} value={item.trim()}>{item}</option>
                        ))}
                    </select>
                    <button className='bg-slate-400 hover:bg-slate-600 box-border rounded-2xl p-1 border-1 text-white' onClick={handleSortClick}>
                        {ascending ? 'High To Low' : 'Low To High'}
                    </button>
                    <select
                        name='searchColumn'
                        onChange={handleSearchColumnChange}
                        value={searchColumn}
                        className='text-center w-1/4 p-1 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                        <option value="" disabled>Search By</option>
                        {searchOptions.map((item, index) => (
                            <option key={index} value={item.trim()}>{item}</option>
                        ))}
                    </select>
                    <input
                        type='text'
                        placeholder='Search term'
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className='text-center w-1/4 p-1 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <CiSearch className='cursor-pointer hover:scale-125 text-2xl ease-in duration-300' onClick={handleSearchClick} />
                </div>
                {notification && (
                    <div className="fixed bottom-5 right-5 bg-blue-500 text-white p-2 rounded shadow-lg">
                        {notification}
                    </div>
                )}
                <div className="mx-auto pt-10 container">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.no</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Id</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supply Id</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supply Quantity</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Quantity</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supply Rate</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lower Limit</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upper Limit</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asked Quantity</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-100 border-b border-gray-200">
                                    <td className="py-2 px-4 text-sm font-medium text-gray-700">{index + 1}</td>
                                    <td className="py-2 px-4 text-sm text-gray-700">{item.vendor_name}</td>
                                    <td className="py-2 px-4 text-sm text-gray-700">{item.cat_name}</td>
                                    <td className="py-2 px-4 text-sm text-gray-700">{item.cat_id}</td>
                                    <td className="py-2 px-4 text-sm text-gray-700">{item.s_id}</td>
                                    <td className="py-2 px-4 text-sm text-gray-700">{item.supply_quantity}</td>
                                    <td className="py-2 px-4 text-sm text-gray-700">{item.vendor_supply}</td>
                                    <td className="py-2 px-4 text-sm text-gray-700">{item.supply_rate}</td>
                                    <td className="py-2 px-4 text-sm text-gray-700">
                                        <input
                                            type="text"
                                            value={item.lower_limit}
                                            onChange={(e) => handleLowerLimitChange(index, e.target.value)}
                                            className="text-center w-full p-1 border border-gray-300 rounded"
                                        />
                                    </td>
                                    <td className="py-2 px-4 text-sm text-gray-700">
                                        <input
                                            type="text"
                                            value={item.upper_limit}
                                            onChange={(e) => handleUpperLimitChange(index, e.target.value)}
                                            className="text-center w-full p-1 border border-gray-300 rounded"
                                        />
                                    </td>
                                    <td className="py-2 px-4 text-sm text-gray-700">
                                        <input
                                            type="text"
                                            value={item.asked_quantity}
                                            onChange={(e) => handleAskedQuantityChange(index, e.target.value)}
                                            className="text-center w-full p-1 border border-gray-300 rounded"
                                        />
                                    </td>
                                    <td className="py-2 px-4 text-sm text-gray-700">
                                        <button
                                            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-700"
                                            onClick={() => handleBellClick(item)}
                                        >
                                            <FaBell />
                                        </button>
                                    </td>
                                    <td className="py-2 px-4 text-sm text-gray-700">{item.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Sidebar>
        </>
    );
}
