import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaLaptopHouse, FaUserCircle } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { GiNotebook } from "react-icons/gi";
import { DiCodepen } from "react-icons/di";
import { IoExitSharp } from "react-icons/io5";
import { BsChevronCompactRight, BsChevronCompactLeft } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import { FaLink } from 'react-icons/fa';
import { FaHandshake } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserAltSlash } from "react-icons/fa";
import { useLocation } from 'react-router-dom';

export default function Sidebar({ children, page }) {
    const [sideButton, setSideButton] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const [interestedVendorNotifications, setInterestedVendorNotifications] = useState(0);
    const [expandUserManagement, setExpandUserManagement] = React.useState(() => {
        const savedState = localStorage.getItem('expandUserManagement');
        return savedState === 'true';
    });
    const [expandOrderManagement, setExpandOrderManagement] = React.useState(() => {
        const savedState = localStorage.getItem('expandOrderManagement');
        return savedState === 'true';
    });
    const [expandOrderHistory, setExpandOrderHistory] = React.useState(() => {
        const savedState = localStorage.getItem('expandOrderHistory');
        return savedState === 'true';
    });
    const { logout } = React.useContext(AuthContext);
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const interestedVendorResponse = await axios.get('/api/Autharization/interested-vendor-count');
                console.log(interestedVendorResponse);

                setInterestedVendorNotifications(interestedVendorResponse.data.data.count);
            } catch (err) {
                console.error('Error fetching notifications:', err);
            }
        };

        fetchNotifications();
    }, []);

    const handleInterestedVendorClick = async () => {
        try {
            await axios.post('/api/Autharization/mark-all-unread'); // Adjust the API endpoint as needed
            setInterestedVendorNotifications(0); // Reset the notification count to 0
            navigate('/dashboard/interested-vendor'); // Navigate to the interested vendor page
        } catch (err) {
            console.error('Error marking notifications as unread:', err);
        }
    };


    const toggleUserManagement = () => {
        setExpandUserManagement(prev => {
            const newState = !prev;
            localStorage.setItem('expandUserManagement', newState);
            return newState;
        });
    }

    const toggleOrderManagement = () => {
        setExpandOrderManagement(prev => {
            const newState = !prev;
            localStorage.setItem('expandOrderManagement', newState);
            return newState;
        });
    }

    const toggleOrderHistory = () => {
        setExpandOrderHistory(prev => {
            const newState = !prev;
            localStorage.setItem('expandOrderHistory', newState);
            return newState;
        });
    }

    const sideButtonFunction = () => {
        setSideButton(prev => !prev);
    }

    React.useEffect(() => {
        setSideButton(prev => prev);
    }, [sideButton]);

    const handleLogout = async () => {
        const res = await logout();
        if (res.status === 200) {
            alert("logout successful");
            navigate('/login');
        } else {
            alert(res.data.message);
        }
    }
    const isActive = (path) => {
        return location.pathname === path ? { color: 'red', fontWeight: 'bold' } : { color: 'white' };
      };
    return (
        <>
            <div className='flex  h-screen'>
                <div className={`ps-10 bg-gradient-to-r from-customTeal to-green-500  flex flex-col justify-around w-3/12 rounded-e-3xl shadow-2xl ${sideButton ? 'hidden' : ""}`}>

                    <div className='box-border text-center '>
                        <h2 className='box-border font-bold text-start text-white text-xl'>Welcome Back,</h2>
                        <h1 className='text-xl font-bold text-start text-white'>Pawan Mishra!</h1>
                    </div>
                    <div className='h-150'>
                        <ul className='align flex flex-col space-y-4 '>
                        <Link to='/' style={isActive('/')}><li className="flex items-center space-x-2 cursor-pointer  hover:text-black">
                                <FaLaptopHouse className="text-xl" />
                                <span className="text-xl">Dashboard</span>
                            </li></Link>
                            <li className="flexspace-x-2 cursor-pointer flex-col">
                                <div className='flex text-white items-center hover:text-black' onClick={toggleUserManagement}>
                                    <FaUserCircle className="text-xl" />
                                    <span className="text-xl">User Management</span>
                                </div>
                                <ul className={expandUserManagement ? 'text-white flex flex-col justify-center ms-10 text-sm' : 'hidden'}>
                                    <Link to='/dashboard/vendor/vendors' style={isActive('/dashboard/vendor/vendors')}><li className='hover:text-black'>&#x2022;Vendors</li></Link>
                                    <Link to='/dashboard/buyer/buyers' style={isActive('/dashboard/buyer/buyers')}><li className='hover:text-black'>&#x2022;Buyers</li></Link>
                                    <Link to='/dashboard/delivery_agent/allgents' style={isActive('/dashboard/delivery_agent/allgents')}><li className='hover:text-black'>&#x2022;Delivery Agent</li></Link>
                                </ul>
                            </li>
                            <Link to='/dashboard/category/category' style={isActive('/dashboard/category/category')}>
                                <li className=" hover:text-black flex items-center space-x-2 cursor-pointer">
                                    <BiSolidCategory className=" text-xl " />
                                    <span className="   text-xl">Category Management</span>
                                </li>
                            </Link>
                            <li className="flexspace-x-2 cursor-pointer flex-col" >
                                <div className='flex text-white  items-center hover:text-black' onClick={toggleOrderManagement}>
                                    <DiCodepen className=" text-xl" />
                                    <span className="text-xl">Order Management</span>
                                </div>
                                <ul className={expandOrderManagement ? 'text-white flex flex-col justify-center ms-10 text-sm' : 'hidden'}>
                                    <Link to='/dashboard/supplytable' style={isActive('/dashboard/supplytable')}><li className='hover:text-black'>&#x2022;Supply</li></Link>
                                    <Link to='/dashboard/requirement/allrequirement' style={isActive('/dashboard/requirement/allrequirement')}><li className='hover:text-black'>&#x2022;Requirement</li></Link>
                                    <Link to='/dashboard/maintable' style={isActive('/dashboard/maintable')}><li className='hover:text-black'>&#x2022;MainOrder Table</li></Link>
                                </ul>
                            </li>
                            <li className="flexspace-x-2 cursor-pointer flex-col">
                                <div className='flex text-white hover:text-black  items-center' onClick={toggleOrderHistory}>
                                    <DiCodepen className=" text-xl" />
                                    <span className="text-xl">Order History</span>
                                </div>
                                <ul className={expandOrderHistory ? 'text-white flex flex-col justify-center ms-10 text-sm' : 'hidden'}>
                                    <Link to='/dashboard/history/supplytable' style={isActive('/dashboard/history/supplytable')}><li className='hover:text-black'>&#x2022;Supply</li></Link>
                                    <Link to='/dashboard/history/requirementtable' style={isActive('/dashboard/history/requirementtable')}><li className='hover:text-black'>&#x2022;Requirement</li></Link>
                                    <Link to='/dashboard/history/maintable' style={isActive('/dashboard/history/maintable')}><li className='hover:text-black'>&#x2022;MainOrder Table</li></Link>
                                </ul>
                            </li>
                            <Link to='/dashboard/requirement/addrequirement' style={isActive('/dashboard/requirement/addrequirement')}>
                                <li className=" hover:text-black flex items-center space-x-2 cursor-pointer">
                                    <GiNotebook className="text-xl " />
                                    <span className="  text-xl">Add Requirement</span>
                                </li>
                            </Link>
                            <Link to='/dashboard/update-links' style={isActive('/dashboard/update-links')}>
                                <li className=" hover:text-black flex items-center space-x-2 cursor-pointer">
                                    <FaLink className="text-xl " />
                                    <span className="  text-xl">Update Links</span>
                                </li>
                            </Link>
                            <Link to='/dashboard/deactivateaccount' style={isActive('/dashboard/deactivateaccount')}>
                                <li className=" hover:text-black flex items-center space-x-2 cursor-pointer">
                                    <FaUserAltSlash className="text-xl " />
                                    <span className="  text-xl">Deactivated Account</span>
                                </li>
                            </Link>
                            <li className=" hover:text-black flex items-center space-x-2 cursor-pointer" style={isActive('/dashboard/interested-vendor')} onClick={handleInterestedVendorClick}>
                                <FaHandshake className="text-xl" />
                                <span  className="text-xl">Interested Vendor</span>
                                {interestedVendorNotifications > 0 && (
                                    <div className="relative">
                                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">
                                                {interestedVendorNotifications}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </li>


                        </ul>
                    </div>
                    <div className="pb-10">
                        <div className="flex items-center text-white hover:text-black space-x-2 cursor-pointer" onClick={handleLogout}>
                            <IoExitSharp className="text-4xl" />
                            <span className="text-xl">logout</span>
                        </div>
                    </div>

                </div>
                <div className={sideButton ? "flex justify-start items-center h-screen" : 'self-center flex justify-center'}>
                    <button className='text-4xl rounded-e-3xl h-40 bg-gradient-to-r from-customTeal to-green-500 shadow-left hover:text-white' onClick={sideButtonFunction}>
                        {sideButton ? <BsChevronCompactRight /> : <BsChevronCompactLeft />}
                    </button>
                </div>
                <div className='w-full'>

                    <div className='flex items-center text-3xl font-bold mt-10 ms-5'>
                        <FaRegUserCircle style={{ color: 'green' }} className='text-3xl items-center mt-1 ' />
                        <h1 style={{ color: 'green' }}>{page}</h1>
                    </div>
                    <div style={{ height: "90%" }} className=' overflow-auto'>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
