import React from 'react';
import Sidebar from '../component/Sidebar';
import { useNavigate } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

const sortByOptions = ['quantity', 'date', 'bided_quantity', 'no_of_bids'];
const searchOptions = ['requirement_id', 'category_name', 'category_id'];

export default function Requirement_Table() {
    const [data, setData] = React.useState([]);
    const [initialData, setInitialData] = React.useState([]);
    const [sortby, setSortBy] = React.useState('');
    const [ascending, setAscending] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchColumn, setSearchColumn] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(0);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL+'/api/requirement/pending-requirement');

                const fetchedData = res.data.results.map(item => ({
                    s_no: item.req_id,
                    requirement_id: item.req_id,
                    category_name: item.cat_name,
                    category_id: item.list_cat_id,
                    quantity: `${item.req_quantity} kg`,
                    date: new Date(item.create_at).toLocaleDateString(),
                    bided_quantity: item.req_price,
                    buyerid: item.b_id,
                    status: item.req_status
                }));
         
                setData(fetchedData);
                setInitialData(fetchedData);
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
            setCurrentPage(0); // Reset to first page after search
        }
    };

    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    const displayedData = data.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <>
            <Sidebar page={'Requirement Table'}>
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
                <div className="mx-auto pt-10 container ">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.no</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirement ID</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category ID</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RQ Rate</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer Id</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
                              
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {displayedData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-2 px-4">{currentPage * itemsPerPage + index + 1}</td>
                                    <td className="py-2 px-4">{row.requirement_id}</td>
                                    <td className="py-2 px-4">{row.category_name}</td>
                                    <td className="py-2 px-4">{row.category_id}</td>
                                    <td className="py-2 px-4">{row.quantity}</td>
                                    <td className="py-2 px-4">{row.date}</td>
                                    <td className="py-2 px-4">
                                        Rs  {parseFloat(row.bided_quantity).toFixed(2)}
                                        </td>
                                    <td className="py-2 px-4">{row.buyerid}</td>
                                    <td className="py-2 px-4">{row.status}</td>
                                    <td className="py-2 px-4">
                                        <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => navigate(`/complete-requirement/${row.requirement_id}`)}>
                                            View
                                        </button>
                                    </td>
                                    <td className="py-2 px-4">
                                        <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => navigate(`/dashboard/requirement/detail/${row.requirement_id}`)}>
                                            Edit
                                        </button>
                                        </td>
                                   
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ReactPaginate
                        previousLabel={'Previous'}
                        nextLabel={'Next'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(data.length / itemsPerPage)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={'flex space-x-2 mt-4'}
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link bg-white text-gray-800 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100'}
                        previousLinkClassName={'page-link bg-white text-gray-800 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100'}
                        nextLinkClassName={'page-link bg-white text-gray-800 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100'}
                        activeClassName={'bg-blue-500 text-white'}
                    />
                </div>
            </Sidebar>
        </>
    );
}
