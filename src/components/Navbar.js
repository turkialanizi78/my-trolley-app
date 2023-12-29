// Navbar.js

import React, { useEffect, useState }  from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser  } from '../hooks/UserContext';
 
import './navbar.css';
import { logUserAction } from '../services/api';
import {  HouseExclamation, Incognito, PersonDown } from 'react-bootstrap-icons';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [userLocation, setUserLocation] = useState('');

  useEffect(() => {
    // Retrieve the user's selected location from localStorage
    const storedLocation = localStorage.getItem('location');

    // Update the state with the retrieved location
    setUserLocation(storedLocation);
  }, []);
 
  // عمل خروج ومسح الكوكيز عند اغلاق الصفحة
 
    // useEffect(() => {
    //   const handleUnload = () => {
    //     // Perform cleanup operations when the user closes the entire project
        
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('user');
    //     localStorage.removeItem('location');
    //     setTimeout(() => {
    //      // window.location.href = '/';
    //      navigate('/');
    //    }, 100);
    //   };
    
    //   // Add the event listener when the component mounts
    //   window.addEventListener('unload', handleUnload);
    
    //   // Remove the event listener when the component unmounts
    //   return () => {
    //     window.removeEventListener('unload', handleUnload);
    //   };
    // }, [navigate]);
   


  const handleLogout = async () => {
    await logUserAction('تسجيل خروجه', {
      // Add specific details as needed
      page: window.location.pathname,
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('location');
    navigate('/');
  };
   
  const handleAdminPanel = () => {
    navigate('/admin');
  };

  const handleTrolly = () => {
    navigate('/trolleys');
  };

  const isAdmin = user ? user.isAdmin : false;
  const isManager = user ? user.isManager : false;
  
  return (
    <nav className="navbar">
      <button onClick={handleTrolly} className="btn">
      <HouseExclamation className="ic" size="20"/>
        Trolleys Home
      </button>
      {isAdmin || isManager ?  (
        <button className="btn" onClick={handleAdminPanel}>
        <Incognito className="ic" size="20"/>
          Admin Panel
        </button>
      ):null}
      <h1>Location: {userLocation ? userLocation : 'Loading...'}</h1>
       
      <button className="btn" onClick={handleLogout}>
      <PersonDown className="ic" size="20"/>
        LogOut
      </button>
    </nav>
  );
};

export default Navbar;
