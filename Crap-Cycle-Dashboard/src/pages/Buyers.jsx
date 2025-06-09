import React from "react";
import Sidebar from "./../component/Sidebar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";

export default function Buyer() {
  const [data, setData] = React.useState([]); // State to hold fetched data
  const [searchQuery, setSearchQuery] = React.useState(""); // State to hold search query
  const [currentPage, setCurrentPage] = React.useState(0); // State to hold current page
  const [buyersPerPage] = React.useState(10); // State to hold buyers per page

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/buyer/allbuyer",
        );
        setData(res.data.data); // Set fetched data to state
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageClick = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const filteredData = data.filter(
    (row) =>
      row.b_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.b_id.toString().includes(searchQuery.toLowerCase()) ||
      row.b_mobile.includes(searchQuery) ||
      row.b_company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.b_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.b_address.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Get current buyers
  const offset = currentPage * buyersPerPage;
  const currentBuyers = filteredData.slice(offset, offset + buyersPerPage);

  return (
    <>
      <Sidebar page={"Buyers"}>
        {/* Hero Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 mb-8 shadow-2xl">
          {/* Background Animation Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div
              className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
              style={{ animationDelay: "4s" }}
            ></div>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center mr-4 shadow-xl">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                    Buyers Hub
                    <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                      {data.length} Active
                    </span>
                  </h1>
                  <p className="text-xl text-purple-100 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      ></path>
                    </svg>
                    Enterprise-grade buyer management platform
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Stats Cards */}
              <div className="hidden lg:flex space-x-4">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">
                    {data.length}
                  </div>
                  <div className="text-cyan-200 text-sm">Total Buyers</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">
                    {filteredData.length}
                  </div>
                  <div className="text-cyan-200 text-sm">Active Today</div>
                </div>
              </div>

              <button
                className="group bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 flex items-center border border-white/20"
                onClick={() => navigate("/dashboard/buyer/add")}
              >
                <svg
                  className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Add New Buyer
                <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Search & Analytics Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1 max-w-2xl">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-6 h-6 text-gray-400 group-focus-within:text-purple-600 transition-colors duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="🔍 Search buyers by name, email, company, or any detail..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-gradient-to-r from-gray-50 to-white"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl px-6 py-3 border border-blue-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentBuyers.length}
                  </div>
                  <div className="text-xs text-blue-500 font-medium">
                    Showing
                  </div>
                </div>
                <div className="w-px h-8 bg-blue-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {filteredData.length}
                  </div>
                  <div className="text-xs text-purple-500 font-medium">
                    Total Found
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200 group">
                  <svg
                    className="w-5 h-5 text-gray-600 group-hover:text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                    ></path>
                  </svg>
                </button>
                <button className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200 group">
                  <svg
                    className="w-5 h-5 text-gray-600 group-hover:text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ultra-Professional Table Container */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
          {/* Table Header with Gradient */}
          <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-purple-50 px-8 py-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                <h3 className="text-xl font-bold text-gray-800">
                  Buyers Database
                </h3>
                <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Live Data
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    ></path>
                  </svg>
                </button>
                <button className="p-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-8 py-6 text-left">
                    <div className="flex items-center group cursor-pointer">
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                        #
                      </span>
                      <svg
                        className="ml-2 w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        ></path>
                      </svg>
                    </div>
                  </th>
                  <th className="px-8 py-6 text-left">
                    <div className="flex items-center group cursor-pointer">
                      <svg
                        className="w-5 h-5 mr-3 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                      </svg>
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                        Contact Person
                      </span>
                    </div>
                  </th>
                  <th className="px-8 py-6 text-left">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                      Buyer ID
                    </span>
                  </th>
                  <th className="px-8 py-6 text-left">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-3 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        ></path>
                      </svg>
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                        Phone
                      </span>
                    </div>
                  </th>
                  <th className="px-8 py-6 text-left">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-3 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        ></path>
                      </svg>
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                        Company
                      </span>
                    </div>
                  </th>
                  <th className="px-8 py-6 text-left">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-3 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        ></path>
                      </svg>
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                        Email
                      </span>
                    </div>
                  </th>
                  <th className="px-8 py-6 text-left">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-3 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                        Location
                      </span>
                    </div>
                  </th>
                  <th className="px-8 py-6 text-left">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-100">
                {currentBuyers.length > 0 ? (
                  currentBuyers.map((row, index) => (
                    <tr
                      key={index}
                      className="group hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-purple-50/80 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] transform"
                    >
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl text-sm font-bold shadow-lg group-hover:shadow-xl transition-all duration-300">
                          {offset + index + 1}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="relative flex-shrink-0">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300">
                              <span className="text-lg font-bold text-white">
                                {row.b_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                          </div>
                          <div className="ml-6">
                            <div className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                              {row.b_name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                              </svg>
                              Active Member
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="inline-flex items-center px-4 py-2 text-sm font-bold rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300 shadow-sm group-hover:shadow-md transition-all duration-200">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                          #{row.b_id}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center bg-green-50 rounded-2xl px-4 py-2 border border-green-200 group-hover:bg-green-100 transition-colors duration-200">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                          <span className="text-sm font-semibold text-green-800">
                            {row.b_mobile}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="bg-blue-50 rounded-2xl px-4 py-3 border border-blue-200 group-hover:bg-blue-100 transition-colors duration-200">
                          <div className="text-sm font-bold text-blue-900">
                            {row.b_company_name}
                          </div>
                          <div className="text-xs text-blue-600 mt-1">
                            Enterprise Client
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="bg-orange-50 rounded-2xl px-4 py-3 border border-orange-200 group-hover:bg-orange-100 transition-colors duration-200">
                          <div className="text-sm font-semibold text-orange-800 hover:text-orange-900 cursor-pointer">
                            {row.b_email}
                          </div>
                          <div className="text-xs text-orange-600 mt-1">
                            Verified Email
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="bg-red-50 rounded-2xl px-4 py-3 border border-red-200 group-hover:bg-red-100 transition-colors duration-200">
                          <div
                            className="text-sm text-red-800 font-medium max-w-xs truncate"
                            title={row.b_address}
                          >
                            <svg
                              className="w-4 h-4 inline mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              ></path>
                            </svg>
                            {row.b_address}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex space-x-3">
                          <Link
                            to={`/dashboard/buyer/profile/${row.b_id}`}
                            className="group/btn inline-flex items-center px-6 py-3 border-2 border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/25"
                          >
                            <svg
                              className="w-5 h-5 mr-2 group-hover/btn:rotate-12 transition-transform duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              ></path>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              ></path>
                            </svg>
                            View Profile
                            <div className="ml-2 w-2 h-2 bg-green-400 rounded-full group-hover/btn:animate-ping"></div>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mb-8 shadow-xl">
                          <svg
                            className="w-16 h-16 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            ></path>
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                          No Buyers Found
                        </h3>
                        <p className="text-lg text-gray-500 mb-8 max-w-md">
                          Start building your network by adding your first buyer
                          to the platform.
                        </p>
                        <button
                          onClick={() => navigate("/dashboard/buyer/add")}
                          className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                        >
                          <svg
                            className="w-6 h-6 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                          </svg>
                          Add Your First Buyer
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Premium Pagination */}
          {filteredData.length > buyersPerPage && (
            <div className="bg-gradient-to-r from-gray-50 via-blue-50 to-purple-50 px-8 py-6 border-t border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-6 py-3 border-2 border-gray-300 text-sm font-bold rounded-2xl text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      ></path>
                    </svg>
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-6 py-3 border-2 border-gray-300 text-sm font-bold rounded-2xl text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Next
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 border border-gray-200 shadow-lg">
                    <p className="text-sm font-semibold text-gray-700 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        ></path>
                      </svg>
                      Showing{" "}
                      <span className="font-bold text-blue-600">
                        {offset + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-bold text-blue-600">
                        {Math.min(offset + buyersPerPage, filteredData.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-purple-600">
                        {filteredData.length}
                      </span>{" "}
                      results
                    </p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-gray-200 shadow-lg">
                    <ReactPaginate
                      previousLabel={
                        <span className="flex items-center px-4 py-2 rounded-xl font-bold text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 19l-7-7 7-7"
                            ></path>
                          </svg>
                          Previous
                        </span>
                      }
                      nextLabel={
                        <span className="flex items-center px-4 py-2 rounded-xl font-bold text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200">
                          Next
                          <svg
                            className="w-4 h-4 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            ></path>
                          </svg>
                        </span>
                      }
                      breakLabel={"⋯"}
                      breakClassName={
                        "flex items-center px-3 py-2 text-gray-500 font-bold"
                      }
                      pageCount={Math.ceil(filteredData.length / buyersPerPage)}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={handlePageClick}
                      containerClassName={"flex items-center space-x-1"}
                      pageClassName={""}
                      pageLinkClassName={
                        "relative inline-flex items-center px-4 py-2 border-2 border-transparent rounded-xl text-sm font-bold text-gray-700 hover:bg-blue-100 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 transform hover:scale-110"
                      }
                      previousLinkClassName={""}
                      nextLinkClassName={""}
                      activeLinkClassName={
                        "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-500 shadow-lg hover:from-blue-600 hover:to-purple-700 hover:text-white transform scale-110"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Sidebar>
    </>
  );
}
