import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { notify, notifyError } from '../Utility/useNotifaction';
import ShowMessageHook from '../hooks/ShowMessageHook';
import './login.css';
import { logUserAction } from '../services/api';
import { PersonHeart } from 'react-bootstrap-icons';

const Login = () => {
  const [message, , showMessage] = ShowMessageHook();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Redirect to the '/trolleys' page if the user is already logged in
      navigate('/trolleys');
    }
  }, [navigate]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 

  // Check if the user has selected a location
  if (selectedLocation < 1) {
    // Display an error message
    showMessage('Please select a location.');
    return;
  }

    try {
      // Make a POST request to the login endpoint
       //const response = await axios.post('https://lionfish-app-2ysfl.ondigitalocean.app/trolley/login', {
         //const response = await axios.post('http://localhost:8000/trolley/login', {
         const response = await axios.post('https://trolley-backend.onrender.com/trolley/login', {

        
        username,
        password,
        location: selectedLocation, // Include selectedLocation in the login request
      });

      // Extract the token and user data from the response
      const { token, user } = response.data;

      // Store the token and user data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('location', selectedLocation);

      // Optionally, you can redirect the user to another page or update the UI
      console.log('Login successful. User:', user);

      // Log the user action
      await logUserAction('تسجيل دخول', {
        page: window.location.pathname,
        location: selectedLocation,
      });

      notify('تم تسجيل الدخول بنجاح');

      setTimeout(() => {
          window.location.href = '/';
    //navigate('/trolleys');
      }, 1500);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        showMessage('Too many login attempts. Please try again later.');
      } else {
        console.error('Error during login:', error);
        notifyError('البيانات المدخلة غير صحيحة');
      }
    }

    // Reset the form after submission
    setUsername('');
    setPassword('');
    setSelectedLocation('');
  };

  return (
    <div className="login-body">
      <div className="login-container">
        {message && <p style={{ color: 'red' }}>{message}</p>}

        <h2 style={{textAlign:'center',fontWeight:'600',fontFamily:'Poppins',color:'red'}}> <PersonHeart color='red' size="30"/>  Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label">
            Username:
            <input type="text" value={username} onChange={handleUsernameChange} style={styles.input} />
          </label>
          <label className="login-label">
            Password:
            <input type="password" value={password} onChange={handlePasswordChange} style={styles.input} />
          </label>
          <label className="login-label">
            Location:
            <select value={selectedLocation} onChange={handleLocationChange} style={styles.input}>
              <option value="">Select Location</option>
              <option value="Gate:04">Gate:04</option>
              <option value="Gate:12">Gate:12</option>
              <option value="Gate:08">Gate:08</option>
              {/* Add more locations as needed */}
            </select>
          </label>
          <button type="submit" className="button">
            Login
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

const styles = {
  input: {
    padding: '5px',
    margin: '5px 0',
    width: '100%',
    boxSizing: 'border-box',
  },
};

export default Login;
