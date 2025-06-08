import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../component/Sidebar';
import axios from 'axios';

const OrderManagementHistory = () => {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);

  const fetchOrderData = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL+`/api/order/get-order-detail/${id}`);
      setOrderData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error('Error fetching order data:', error);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [id]);

  if (!orderData) {
    return <div>Loading...</div>;
  }

  const {
    order_id, cat_name, list_cat_id, order_qty, order_price, order_status,
    b_id, b_name, b_mobile, b_drop_address,
    v_id, v_name, v_mobile, v_address,
    order_otp, d_id, d_mobile, d_name, pick_up, d_phone
  } = orderData[0];

  return (
    <Sidebar page={'Order Management'}>
      <div className="bg-white p-6 rounded-lg max-w-screen-lg mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Order ID Section */}
          <div className="col-span-2 p-6 rounded-lg shadow-md flex flex-wrap justify-between items-start">
            <div className="w-full md:w-1/2 mb-4 md:mb-0">
              <h3 className="font-bold text-lg">Order ID: <span>{order_id}</span></h3>
              <p className="text-gray-700">Category Name: {cat_name}</p>
              <p className="text-gray-700">Category ID: {list_cat_id}</p>
              <p className="text-gray-700">Requirement ID:{orderData[0].req_id}</p>
            </div>
            <div className="w-full md:w-1/2">
              <p className="text-gray-700">Quantity: {order_qty}kg</p>
              <p className="text-gray-700">Order Value: ₹{parseFloat(order_price).toFixed(2)}</p>
              <p className="text-gray-700 w-full">Order Status: <span>{order_status}</span></p>
            </div>
          </div>

          {/* Buyer’s Section */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg">Buyer’s ID: {b_id}</h3>
              <p className="text-gray-700">Name: {b_name}</p>
              <p className="text-gray-700">Phone: {b_mobile}</p>
              <p className="text-gray-700">Drop Location: {b_drop_address}</p>
            </div>
            <hr></hr>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg">Vendor’s ID: {v_id}</h3>
              <p className="text-gray-700">Name: {v_name}</p>
              <p className="text-gray-700">Phone: {v_mobile}</p>
              <p className="text-gray-700">Address: {v_address}</p>
              <div className="flex justify-between items-center">
                <p className="text-gray-700">OTP: <span className="text-green-600 font-semibold">{order_otp}</span></p>
              </div>
            </div>
          </div>

          {/* Delivery Agent Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg">Delivery Agent Info</h3>
            {d_id ? (
              <>
                <p className="text-gray-700">Id: {d_id}</p>
                <p className="text-gray-700">Name: {d_name}</p>
                <p className="text-gray-700">Phone: {d_phone || d_mobile}</p>
                <p className="text-gray-700">Pickup: {pick_up}</p>
              </>
            ) : (
              <p className="text-gray-700">No delivery agent assigned.</p>
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default OrderManagementHistory;
