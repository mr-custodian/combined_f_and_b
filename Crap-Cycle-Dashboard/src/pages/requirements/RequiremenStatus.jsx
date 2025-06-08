import React from 'react';
import Sidebar from '../../component/Sidebar';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FaFilter } from "react-icons/fa";
import axios from 'axios';
import { parseISO, format } from 'date-fns';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const sortByOptions = ['req_price', 'req_quantity', 'create_at', 'final_amount'];
const searchOptions = ['req_price', 'req_quantity', 'create_at', 'final_amount', 'cat_name', 'list_cat_id', 'req_id'];
const filterList = ['Pending', 'Confirmed', 'Cancelled', 'Delivered'];

export default function RequirementStatus() {
    const [data, setData] = React.useState([]);
    const [initialData, setInitialData] = React.useState([]);
    const [sortby, setSortBy] = React.useState('');
    const [ascending, setAscending] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchColumn, setSearchColumn] = React.useState('');
    const [filter, setFilter] = React.useState('');
    const navigate = useNavigate();

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleSortClick = () => {
        const sortedData = [...data].sort((a, b) => {
            let aValue = a[sortby];
            let bValue = b[sortby];

            if (sortby === 'final_amount') {
                aValue = a.req_quantity * a.req_price;
                bValue = b.req_quantity * b.req_price;
            } else if (sortby === 'create_at') {
                aValue = new Date(a.create_at);
                bValue = new Date(b.create_at);
            }

            if (ascending) {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
        setData(sortedData);
        setAscending(!ascending);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchColumnChange = (event) => {
        setSearchColumn(event.target.value);
    };

    const handleFilterStatusChange = (event) => {
        setFilter(event.target.value);
    };

    const handleSearchClick = () => {
        if (searchColumn && searchTerm) {
            const filteredData = initialData.filter(item =>
                item[searchColumn]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
            setData(filteredData);
        } else {
            setData(initialData);
        }
        
    };

    const handleFilterClick = () => {
        if (filter) {
            const filteredData = initialData.filter(item =>
                item.req_status?.toString().toLowerCase().includes(filter.toLowerCase())
            );
            setData(filteredData);
        } else {
            setData(initialData);
        }
        console.log('Filter Clicked', { filter, filteredData: filteredData });
    };

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL+'/api/requirement/all-requirement');
              
                setData(res.data.results);
                setInitialData(res.data.results);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <Sidebar page={'Requirement Management'}>
                <div className='flex justify-end text-xl font-bold mt-5'>
                    <button className="bg-green-700 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-3xl me-3" onClick={() => navigate('/dashboard/requirement/addrequirement')}>
                        + Add Requirement
                    </button>
                </div>
                <div className='flex justify-around items-center mt-3'>
                    <select
                        name='sortby'
                        onChange={handleSortChange}
                        value={sortby}
                        className='text-center w-1/4 p-1 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                        <option value="" disabled>Sort By</option>
                        {sortByOptions.map((item, index) => (
                            <option key={index} value={item.trim()}>{item.replace('_', ' ').toUpperCase()}</option>
                        ))}
                    </select>
                    <button className='bg-slate-400 hover:bg-slate-600 box-border rounded-2xl p-1 border-1 text-white' onClick={handleSortClick}>
                        {ascending ? 'Ascending' : 'Descending'}
                    </button>
                    <select
                        name='searchColumn'
                        onChange={handleSearchColumnChange}
                        value={searchColumn}
                        className='text-center w-1/4 p-1 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                        <option value="" disabled>Search By</option>
                        {searchOptions.map((item, index) => (
                            <option key={index} value={item.trim()}>{item.replace('_', ' ').toUpperCase()}</option>
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
                <div className='flex justify-around items-center mt-3'>
                    <select
                        name='filter'
                        onChange={handleFilterStatusChange}
                        value={filter}
                        className='text-center w-3/4 p-1 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                        <option value="" disabled>Filter By Status</option>
                        {filterList.map((item, index) => (
                            <option key={index} value={item.trim()}>{item}</option>
                        ))}
                    </select>
                    <FaFilter className='cursor-pointer hover:text-gray-400 text-2xl ease-in duration-100' onClick={handleFilterClick} />
                </div>
                <div className="mx-auto pt-10 container w-screen">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.no</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category ID</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirement ID</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Amount</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-2 px-4">{index + 1}</td>
                                    <td className="py-2 px-4">{row.cat_name}</td>
                                    <td className="py-2 px-4">{row.list_cat_id}</td>
                                    <td className="py-2 px-4">{row.req_quantity}</td>
                                    <td className="py-2 px-4">{format(parseISO(row.create_at), 'MM/dd/yy')}</td>
                                    <td className="py-2 px-4">{row.req_id}</td>
                                    <td className="py-2 px-4">{row.req_price}</td>
                                    <td className="py-2 px-4">{row.req_quantity * row.req_price}</td>
                                    <td className="py-2 px-4">{row.req_status}</td>
                                    <td className="py-2 px-4">
                                        <Link to={`/dashboard/requirement/detail/${row.req_id}`} className="text-blue-500 hover:underline">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Sidebar>
        </>
    );
}
