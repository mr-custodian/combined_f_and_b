import React from 'react';
import Sidebar from '../../component/Sidebar';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import axios from 'axios';
import ReactPaginate from 'react-paginate';

const sortByOptions = ['current_requirement', 'bidden_requirement', 'no_of_listing', 'no_of_bidding'];
const searchOptions = ['cat_name', 'cat_id', 'curr_requirement', 'bidden_requirement', 'No_listing', 'no_bidding', 'parent'];
const categoryMap = new Map();
categoryMap.set(-1, "N/A");

export default function CategoryManagement() {
    const [data, setData] = React.useState([]);
    const [initialData, setInitialData] = React.useState([]);
    const [sortby, setSortBy] = React.useState('');
    const [ascending, setAscending] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchColumn, setSearchColumn] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(0);
    const [perPage] = React.useState(10); // Number of items per page

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
        if (searchColumn && searchTerm) {
            const filteredData = initialData.filter(item => {
                // Ensure that the item has the search column and perform case-insensitive search
                if (item[searchColumn]) {
                    return item[searchColumn].toString().toLowerCase().includes(searchTerm.toLowerCase());
                }
                return false;
            });
            setData(filteredData);
        } else {
            // If no search term or column is provided, reset to the initial data
            setData(initialData);
        }
        setCurrentPage(0); // Reset to the first page after search
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/category/category-bidden');
                setData(res.data.data);
                setInitialData(res.data.data);
                res.data.data.forEach((cat) => {
                    categoryMap.set(cat.cat_id, cat.cat_name);
                });
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, []);

    // Calculate current page data
    const offset = currentPage * perPage;
    const currentPageData = data.slice(offset, offset + perPage);

    return (
        <>
            <Sidebar page={'Category Management'}>
                <div className='flex justify-end text-xl font-bold mt-5'>
                    <button className="bg-green-700 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-3xl me-3" onClick={(event) => navigate('/dashboard/category/addcategory')}>
                        + Add Category
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
                    <CiSearch className='cursor-pointer hover:scale-125  text-2xl ease-in duration-300' onClick={handleSearchClick} />
                </div>
                <div className="mx-auto pt-10 container">
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
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentPageData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-2 px-4">{offset + index + 1}</td>
                                    <td className="py-2 px-4">{row.cat_name}</td>
                                    <td className="py-2 px-4">{row.cat_id}</td>
                                    <td className="py-2 px-4">{row.curr_requirement}</td>
                                    <td className="py-2 px-4">{row.bidden_requirement}</td>
                                    <td className="py-2 px-4">{row.No_listing}</td>
                                    <td className="py-2 px-4">{row.no_bidding}</td>
                                    <td className="py-2 px-4">{categoryMap.get(row.parent)}</td>
                                    <td className="py-2 px-4">
                                        <Link to={`/dashboard/category/CategoryDetail/${row.cat_id}`} className="text-blue-500 hover:underline">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-4">
                    <ReactPaginate
                        previousLabel={'Previous'}
                        nextLabel={'Next'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(data.length / perPage)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={'flex space-x-2'}
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link bg-white text-gray-800 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100'}
                        previousLinkClassName={'page-link bg-white text-gray-800 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100'}
                        nextLinkClassName={'page-link bg-white text-gray-800 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100'}
                        activeLinkClassName={'bg-gray-200 font-bold'}
                    />
                </div>
            </Sidebar>
        </>
    );
}
