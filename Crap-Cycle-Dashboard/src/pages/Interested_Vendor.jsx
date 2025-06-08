import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './../component/Sidebar';

function InterestedVendorInfo() {
  const [interestedVendors, setInterestedVendors] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchInterestedVendors = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL+'/api/Autharization/signUp-get');
        console.log(response);
        setInterestedVendors(response.data.data);
        setLoading(false);
      } catch (err) {
      
        setLoading(false);
      }
    };

    fetchInterestedVendors();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  

  return (
    <Sidebar page={'Interested Vendors'}>
      <div className="flex justify-center">
        <div className="bg-white p-8 rounded border w-full mx-4">
          <table className="w-full border-collapse">
            <thead>
              <tr>
            
                <th className="border-b-2 p-4 text-left">Vendor Name</th>
                <th className="border-b-2 p-4 text-left">Phone No.</th>
               
                <th className="border-b-2 p-4 text-left">Email ID</th>
             
              </tr>
            </thead>
            <tbody>
              {interestedVendors.length > 0 ? (
                interestedVendors.map((vendor) => (
                  <tr key={vendor.v_id}>
                    <td className="border-b p-4">{vendor.v_name}</td>
                    <td className="border-b p-4">{vendor.v_mobile}</td>
                    <td className="border-b p-4">{vendor.v_email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-4">No interested vendors found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Sidebar>
  );
}

export default InterestedVendorInfo;
