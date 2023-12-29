// UserContext.js

import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser } from '../services/api';

const UserContext = createContext();

let updateUser; // Move this line to the top

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  updateUser = (newUserData) => {
    setUser(newUserData);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser !== undefined) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } else {
          const currentUserData = await getCurrentUser();
          setUser(currentUserData.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { updateUser };