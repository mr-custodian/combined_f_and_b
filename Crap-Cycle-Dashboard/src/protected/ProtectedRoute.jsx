// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { auth, loading } = useContext(AuthContext);
  console.log(auth)  
  const location = useLocation();

  if (loading ) {
    // Optionally, render a loading indicator here
    return <div>Loading...</div>;
  }
  
  if (!auth|| auth.user.role !="dashboardUser") {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
