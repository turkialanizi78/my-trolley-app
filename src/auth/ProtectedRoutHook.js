/* eslint-disable no-unused-vars */
import  { useEffect, useState } from 'react'

const ProtectedRoutHook = () => {
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("user")));
    const [isUser, setIsUser] = useState();
    const [isAdmin, setIsAdmin] = useState();
    const [isManager, setIsManager] = useState();

    
    useEffect(() => {
      if (userData !== null && userData !== undefined && userData.employeeData !== null && userData.employeeData !== undefined) {
        const position = userData.employeeData.position;
        if (position === "Operator") {
          setIsUser(true);
          setIsAdmin(false);
          setIsManager(false);
         
        } else if (position === "Administrator") {
          setIsUser(false);
          setIsAdmin(true);
          setIsManager(false);
         
        } else if (position === "Manager") {
          setIsUser(false);
          setIsAdmin(false);
          setIsManager(true);
        } else {
          setIsAdmin(false);
          setIsUser(false);
          setIsManager(false);
        }
      } else {
        setIsAdmin(false);
        setIsUser(false);
        setIsManager(false);
      }
    }, [userData]);
    
 
  return [isUser, isAdmin , isManager];
};

export default ProtectedRoutHook