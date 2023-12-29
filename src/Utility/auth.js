// Function to retrieve the authentication token from local storage
export const getAuthToken = () => {
    return localStorage.getItem('token');
  };