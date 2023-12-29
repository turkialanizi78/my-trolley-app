import axios from "axios";
import { getAuthToken } from "../Utility/auth";

  // const API_URL = "http://localhost:8000/trolley";
   //const API_URL = "https://lionfish-app-2ysfl.ondigitalocean.app/trolley";
    const API_URL = "https://trolley-backend.onrender.com/trolley";
   
export const getAllTrolleys = () => axios.get(`${API_URL}/getAllTrolleys`);
export const getTrolleyById = (id) => axios.get(`${API_URL}/getTrolley/${id}`);
export const addTrolley = (trolleyData) => {
  const authToken = getAuthToken(); 
  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
  return axios.post(`${API_URL}/addTrolley`, trolleyData, config);
};


export const getTrolleysByTrolleyNumber = (trolleyNumber) => {
  const authToken = getAuthToken();
  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
  return axios.get(`${API_URL}/getTrolleys/${trolleyNumber}`, config);
};

export const updateTrolley = (balanceNumber, updatedTrolleyData) => {
  // Log the data to the console for debugging
  console.log(updatedTrolleyData);

  // Extract only the required fields expected by the server
  const { isOutside, trolleyNumber,  departureTime, returnTime,rentalAmount,remainingAmount, deliveryLocation } = updatedTrolleyData;
 

  // Create a new object with the required fields
  const updatedDataForServer = {
    isOutside,
    trolleyNumber ,
    departureTime,
    returnTime,
    rentalAmount,
    remainingAmount,
    deliveryLocation,
    // Add other required fields as needed
  };

  const authToken = getAuthToken();
  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  return axios.put(
    `${API_URL}/updateTrolley/${balanceNumber}`,
    updatedDataForServer,
    config
  );
};

export const deleteTrolley = (balanceNumber) => {
  const authToken = getAuthToken(); // Example function to retrieve the authentication token
  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  return axios.delete(`${API_URL}/deleteTrolley/${balanceNumber}`, config);
};
// Add other API requests as needed

export const getAllTrolleyNumbers = () =>
  axios.get(`${API_URL}/getAllTrolleyNumbers`);
export const getTrolleyNumberByNumber = (trolleyNumber) =>
  axios.get(`${API_URL}/getTrolleyNumber/${trolleyNumber}`);
export const addTrolleyNumber = (trolleyNumberData) =>
{ const authToken = getAuthToken(); // Example function to retrieve the authentication token
const config = {
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
};
return axios.post(`${API_URL}/addTrolleyNumber`, trolleyNumberData, config)};
export const updateTrolleyNumber = (
  trolleyNumber,
  updatedTrolleyNumberData
) => {
  const authToken = getAuthToken(); // Example function to retrieve the authentication token
  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
  return axios.put(
    `${API_URL}/updateTrolleyNumber/${trolleyNumber}`,
    updatedTrolleyNumberData,
    config
  );
};
export const deleteTrolleyNumber = (trolleyNumber) => {
  const authToken = getAuthToken(); // Example function to retrieve the authentication token
  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
  return axios.delete(
    `${API_URL}/deleteTrolleyNumber/${trolleyNumber}`,
    config
  );
};

export const getAllEmployees = () => {
  const authToken = getAuthToken(); // Example function to retrieve the authentication token
  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
  return axios.get(`${API_URL}/getAllEmployees`,config)};


export const addEmployee = (employeeData) =>
{
  const authToken = getAuthToken(); // Example function to retrieve the authentication token
  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
  return axios.post(`${API_URL}/addEmployee`, employeeData,config)};

  export const deleteEmployee = (employeeId) => {
    const authToken = getAuthToken();
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  
    return axios.delete(`${API_URL}/deleteEmployee/${employeeId}`, config);
  };
  
  export const updateEmployee = (employeeId, updatedAdminData) => {
    const authToken = getAuthToken();
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  
    return axios.put(
      `${API_URL}/updateEmployee/${employeeId}`,
      updatedAdminData,
      config
    );
  };





export const getAdminEmployees = () => {
  const authToken = getAuthToken(); // Example function to retrieve the authentication token
  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
  return axios.get(`${API_URL}/getAdminEmployees`,config)};

export const addAdmin = (adminData) =>
{
  const authToken = getAuthToken(); // Example function to retrieve the authentication token
  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
  return axios.post(`${API_URL}/addAdmin`, adminData,config)};

 
  export const updateAdmin = (adminId, updatedAdminData) => {
    const authToken = getAuthToken();
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  
    return axios.put(
      `${API_URL}/updateAdmin/${adminId}`,
      updatedAdminData,
      config
    );
  };


  
  export const deleteAdmin = (adminId) => {
    const authToken = getAuthToken();
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  
    return axios.delete(`${API_URL}/deleteAdmin/${adminId}`, config);
  };
  
  export const getAdminById = (adminId) => {
    const authToken = getAuthToken();
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  
    return axios.get(`${API_URL}/getAdmin/${adminId}`, config);
  };


  export const getCurrentUser = async () => {
    const authToken = localStorage.getItem('token'); // Assuming you store the token in localStorage
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  
    try {
      const response = await axios.get(`${API_URL}/getCurrentUser`, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  

export const login = (loginData) => axios.post(`${API_URL}/login`, loginData);
export const logout = () => axios.post(`${API_URL}/logout`);
export const getProfile = () => axios.get(`${API_URL}/profile`);
// Add other employee-related API requests as needed
export const logUserAction = async (action, details) => {
  const authToken = localStorage.getItem('token');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      action,
      details: {
        ...details,
        page: window.location.pathname, // Capture the current page
      },
    }),
  };

  try {
    const response = await axios.post(`${API_URL}/log`, { action, details }, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update the function that fetches admin user logs
export const getAdminUserLogs = async (date) => {
  const authToken = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  try {
    const response = await axios.get(`${API_URL}/logs${date ? `?date=${date}` : ''}`, config);

    // Check if the response object is defined and has the expected structure
    if (response && response.data && response.data.userLogs) {
      return response.data.userLogs;
    } else {
      // Handle the case where the expected data is not available
      console.error('Error fetching admin user logs: Data structure is unexpected');
      return null;
    }
  } catch (error) {
    console.error('Error fetching admin user logs:', error);
    throw error;
  }
};

export const deleteLogsByDate = async (date) => {
  const authToken = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }; 
  return axios.delete(
    `${API_URL}/logs/${date}`,
    config
  );
};