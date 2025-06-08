import React from 'react';
import Sidebar from '../../component/Sidebar';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";




const initialData = [
    {
        "s_no": 1,
        "category_name": "Electronics",
        "category_id": "CAT123",
        "current_requirement": 100,
        "bidden_requirement": 90,
        "no_of_listing": 50,
        "no_of_bidding": 45,
        "category_details": "Details about Electronics"
    },
    {
        "s_no": 2,
        "category_name": "Home Appliances",
        "category_id": "CAT124",
        "current_requirement": 200,
        "bidden_requirement": 180,
        "no_of_listing": 75,
        "no_of_bidding": 70,
        "category_details": "Details about Home Appliances"
    },
    {
        "s_no": 3,
        "category_name": "Fashion",
        "category_id": "CAT125",
        "current_requirement": 150,
        "bidden_requirement": 140,
        "no_of_listing": 60,
        "no_of_bidding": 55,
        "category_details": "Details about Fashion"
    },
    {
        "s_no": 4,
        "category_name": "Books",
        "category_id": "CAT126",
        "current_requirement": 120,
        "bidden_requirement": 110,
        "no_of_listing": 80,
        "no_of_bidding": 75,
        "category_details": "Details about Books"
    },
    {
        "s_no": 5,
        "category_name": "Toys",
        "category_id": "CAT127",
        "current_requirement": 90,
        "bidden_requirement": 85,
        "no_of_listing": 40,
        "no_of_bidding": 38,
        "category_details": "Details about Toys"
    }
];

const sortByOptions = ['current_requirement', 'bidden_requirement', 'no_of_listing', 'no_of_bidding'];
const searchOptions = ['category_name', 'category_id', 'category_details'];

export default function CategoryManagement() {
    const [data, setData] = React.useState(initialData);
    const [sortby, setSortBy] = React.useState('');
    const [ascending, setAscending] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchColumn, setSearchColumn] = React.useState('');
    const navigate = useNavigate();

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleSortClick = () => {
        const sortedData = [...data].sort((a, b) => {
            if (sortby) {
                if (ascending) {
                    return a[sortby] > b[sortby] ? 1 : -1;
                } else {
                    return a[sortby] < b[sortby] ? 1 : -1;
                }
            }
            return 0;
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

    const handleSearchClick = () => {
        if (searchColumn) {
            const filteredData = initialData.filter(item => 
                item[searchColumn].toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
            setData(filteredData);
        }
    };

    return (
        <>
            <Sidebar page={'Category Management'}>
                <div className='flex justify-end text-xl font-bold mt-5'>
                    <button className="bg-green-700 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-3xl me-3" onClick={(event) => navigate('/addcategory')}>
                        + Add Category
                    </button>
                </div>
                <div className='flex justify-center text-3xl font-bold mt-5 ms-10'>
                <span className="text-gray-400">Sub category</span>
                </div>
                <div className='flex justify-start text-xl font-bold mt-5 ms-10'>
                <span className="text-green-400">Aluminium</span>
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
                    {/* <button >
                        Search
                    </button> */}
                    < CiSearch className='cursor-pointer hover:scale-125  text-2xl ease-in duration-300' onClick={handleSearchClick} />
                </div>
                <div className="mx-auto pt-10 container w-screen">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.no</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category ID</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Requirement</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bidden Requirement</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Listing</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Bidding</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Details</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-2 px-4">{index + 1}</td>
                                    <td className="py-2 px-4">{row.category_name}</td>
                                    <td className="py-2 px-4">{row.category_id}</td>
                                    <td className="py-2 px-4">{row.current_requirement}</td>
                                    <td className="py-2 px-4">{row.bidden_requirement}</td>
                                    <td className="py-2 px-4">{row.no_of_listing}</td>
                                    <td className="py-2 px-4">{row.no_of_bidding}</td>
                                    <td className="py-2 px-4">
                                        <Link to='/CategoryDetail' className="text-blue-500 hover:underline">
                                            View
                                        </Link>
                                    </td>
                                    <td className="py-2 px-4">
                                        <Link to='/CategoryDetail' className="text-blue-500 hover:underline">
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
