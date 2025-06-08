import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './../component/Sidebar';
function DeactivatedAccountInfo() {
  const [deactivatedAccounts, setDeactivatedAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeactivatedAccounts = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL+'/api/other/deactivated-account-info');
        setDeactivatedAccounts(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchDeactivatedAccounts();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error fetching data: {error.message}
      </div>
    );
  }

  return (
    <Sidebar page={'Deactivated Accounts'}>
    <div className="flex justify-center ">
      <div className="bg-white p-8 rounded border w-full  mx-4">
     
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b-2 p-4 text-left">Vendor ID</th>
              <th className="border-b-2 p-4 text-left">Vendor Name</th>
              <th className="border-b-2 p-4 text-left">Phone No.  </th>
              <th className="border-b-2 p-4 text-left">Company Name</th>
              <th className="border-b-2 p-4 text-left">Email ID</th>
              <th className="border-b-2 p-4 text-left">Address</th>
              <th className="border-b-2 p-4 text-left">Reason</th>
            </tr>
          </thead>
          <tbody>
            {deactivatedAccounts.length > 0 ? (
              deactivatedAccounts.map((account) => (
                <tr key={account.v_id}>
                  <td className="border-b p-4">{account.v_id}</td>
                  <td className="border-b p-4">{account.v_name}</td>
                  <td className="border-b p-4">{account.v_mobile}</td>
                  <td className="border-b p-4">{account.v_email}</td>
                  <td className="border-b p-4">{account.v_companyname}</td>
                  <td className="border-b p-4">{account.v_address}</td>
                  <td className="border-b p-4">{account.Reason}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-4">No deactivated accounts found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </Sidebar>
  );
}

export default DeactivatedAccountInfo;
