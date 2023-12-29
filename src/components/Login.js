import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { notify, notifyError } from '../Utility/useNotifaction';
import ShowMessageHook from '../hooks/ShowMessageHook';
import './login.css';
import { logUserAction } from '../services/api';
import { PersonHeart } from 'react-bootstrap-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';

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
    <div className="bodyLogin">
   <div style={{display:'flex',justifyContent:'center'}} className='container'>
   <div className="loginContainer">
  
      <div className="login-container">
        {message && <p style={{ color: 'red' }}>{message}</p>}

        <h2 style={{textAlign:'center',fontWeight:'600',fontFamily:'Poppins',color:'red'}}> <PersonHeart color='red' size="30"/>  Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="formInput">
            Username:
            <input  placeholder="Type Your Name" type="text" value={username} onChange={handleUsernameChange}  className="inputFiled" />
          </label>
          <label className="mt-4 formInput">
            Password:
            <input  placeholder="Type Your Password" type="password" value={password} onChange={handlePasswordChange}  className="inputFiled" />
          </label>
          <label className="mt-4">
            
            <select value={selectedLocation} onChange={handleLocationChange}  className="inputFiled">
              <option value="">Select Location</option>
              <option value="Gate:04">Gate:04</option>
              <option value="Gate:12">Gate:12</option>
              <option value="Gate:08">Gate:08</option>
              {/* Add more locations as needed */}
            </select>
          </label>
         
          <div className="mt-2">
            <Link to={"/"}>
              <p
                style={{
                  textAlign: "right",
                  marginRight: "10px",
                  color: "gray",
                  fontSize: "12px",
                }}
              >
                Forgat Password
              </p>
            </Link>
          </div>
          <Button type="submit" className="button btn btn-success w-50">
            Login
          </Button>
          <div className="mt-5">
          <p>Or Sign Up Using</p>
        </div>
        </form>
        <ToastContainer />
      </div>
      <div
      style={{ display: "flex", justifyContent: "center" }}
      className="sochialMidiaLogin"
    >
      <Link to={"https://www.instagram.com/0_oturki?igsh=MTE1eW5yaDJ0cTZxbw%3D%3D&utm_source=qr "}>
        <div className="facebook">
          <FontAwesomeIcon icon={["fab", "instagram"]} />
        </div>
      </Link>
      <Link to={"https://www.tiktok.com/@0_0turki?_t=8iaxLpfsTYY&_r=1"}>
        <div className="twiter">
          <FontAwesomeIcon icon={["fab", "tiktok"]} />
        </div>
      </Link>
      <Link to={"https://github.com/turkialanizi78"}>
        <div className="github">
          <FontAwesomeIcon icon={["fab", "github"]} />
        </div>
      </Link>
    </div>
    </div>
    </div>
    </div>
       
  );
};

const styles = {
  container: {
  
 
  },
};

export default Login;
