import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from '../component/Sidebar';

const CompletedRequirements = () => {
    const { id } = useParams(); // Extract the ID from the route parameters
    const [orderDetails, setOrderDetails] = useState({});
    const [completedOrders, setCompletedOrders] = useState([]);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL+`/api/requirement/requirement-detail/${id}`);
                setOrderDetails(res.data.results[0]);
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };

        const fetchCompletedOrders = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL+`/api/order/get-required-order/${id}`);
                setCompletedOrders(res.data.data);
                console.log(res.data.data)
            } catch (error) {
                console.error('Error fetching completed orders:', error);
            }
        };

        fetchOrderDetails();
        fetchCompletedOrders();
    }, [id]); // Dependency array includes the ID

   

    return (
        <Sidebar page={'Complete Requirements'}>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-screen-lg mx-auto mt-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-4 rounded-lg shadow-md">
                        <h2 className="font-bold">Order Details</h2>
                        <p>Requirement ID: {orderDetails.req_id}</p>
                        <p>Category Name: {orderDetails.cat_name}</p>
                        <p>Quantity: {orderDetails.req_quantity}</p>
                        <p>Price: {parseFloat(orderDetails.req_price).toFixed(2)}</p>
                        <p>Note: {orderDetails.req_note}</p>
                        <p>Status: {orderDetails.req_status}</p>
                    </div>
                    <div className="p-4 rounded-lg shadow-md">
                        <h2 className="font-bold">Buyer's Details</h2>
                        <p>Buyer's Name: {orderDetails.b_name}</p>
                        <p>Buyer's Phone No.: {orderDetails.b_moile}</p>
                        <p>Buyer's Address: {orderDetails.b_add}</p>
                        <p>Order drop location: {orderDetails.b_drop_add}</p>
                        <p>Buyer's ID: {orderDetails.b_id}</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.no</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor ID</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order pickup location</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Agent</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Agent ID</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {completedOrders.map((order, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-2 px-4">{index + 1}</td>
                                    <td className="py-2 px-4">{order.v_name}</td>
                                    <td className="py-2 px-4">{order.v_id}</td>
                                    <td className="py-2 px-4">{order.order_id}</td>
                                    <td className="py-2 px-4">{order.order_qty}</td>
                                    <td className="py-2 px-4">{order.v_address}</td>
                                    <td className="py-2 px-4">{order.d_name}</td>
                                    <td className="py-2 px-4">{order.d_id}</td>
                                    <td className="py-2 px-4">{parseFloat(order.order_price).toFixed(2)}</td>
                                    <td className="py-2 px-4">{order.order_status}</td>
                                    <td className="py-2 px-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-white  ${order.payment === "Paid" ? "bg-green-500" : "bg-red-500"}`}
                                           
                                        >
                                            {order.payment}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Sidebar>
    );
};

export default CompletedRequirements;
