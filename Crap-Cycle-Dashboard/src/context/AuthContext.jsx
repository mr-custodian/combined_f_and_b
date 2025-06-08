  // src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.withCredentials = true;
const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/Autharization/checkAuth');
        console.log(response.data)
        if (response?.data?.user?.role === 'dashboardUser') {
          setAuth(response.data);
        }


        // console.log(response.data);
      } catch (error) {
        setAuth(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const interval = setInterval(checkAuth, 1800000000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/Autharization/login', { email, password });
      if (response.status === 200) {
        setAuth(response.data);
        toast("Welcome Pawan!");
      }
      return response;
    } catch (error) {
      return error.response;
    }
  };

  const logout = async () => {
    try {
      await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/Autharization/logout');
      setAuth(null);
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
