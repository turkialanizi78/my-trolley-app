/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { addAdmin, deleteAdmin, getAdminEmployees, logUserAction, updateAdmin } from "../../services/api";
import ShowMessageHook from "../../hooks/ShowMessageHook";
import { Button } from "react-bootstrap";
import ProtectedRoutHook from "../../auth/ProtectedRoutHook";
import './admins.css'
 

const AddAdminComponent = () => {
  const [ isUser, isAdmin,isManager] = ProtectedRoutHook();
  const [employees, setEmployees] = useState([]);
  const [message,messageColor,showMessage] = ShowMessageHook();
  const [employeeData, setEmployeeData] = useState({
    username: "",
    password: "",
    employeeData: {
      firstName: "",
      lastName: "",
      position: "",
      location: "",
      email: "",
    },
  });

  const [selectedAdminId, setSelectedAdminId] = useState(null); // Track the selected admin for editing


  useEffect(() => {
    // Fetch employees when the component mounts
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getAdminEmployees();
      const adminEmploye = response.data.employees
      setEmployees(adminEmploye);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };


  const handleInputChange = (field, value) => {
    setEmployeeData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleEmployeeDataChange = (field, value) => {
    setEmployeeData((prevData) => ({
      ...prevData,
      employeeData: {
        ...prevData.employeeData,
        [field]: value,
      },
    }));
  };

  const handleAddEmployee = async () => {
    try {
      const updatedEmployeeData = { ...employeeData };
  
      // If a new password is not provided, remove the 'password' field
      if (!updatedEmployeeData.password) {
        delete updatedEmployeeData.password;
      }
  
      if (selectedAdminId) {
        // If selectedAdminId is present, update the admin
        await updateAdmin(selectedAdminId, updatedEmployeeData);
        await logUserAction('Update Admin Data', {
          // Add specific details as needed
          page: window.location.pathname,
        });
        showMessage("Admin updated successfully!", "green");
      } else {
        // Otherwise, add a new admin
     
        await addAdmin(updatedEmployeeData);
        await logUserAction('Add New Admin', {
          // Add specific details as needed
          page: window.location.pathname,
        });
        showMessage("Employee Added successfully!", "green");
      }
  
      fetchEmployees(); // Refresh the employee list after adding/updating an admin
      setEmployeeData({
        username: "",
        password: "",
        employeeData: {
          firstName: "",
          lastName: "",
          position: "",
          location:'',
          email: "",
        },
      });
      setSelectedAdminId(null); // Reset selectedAdminId after adding/updating
    } catch (error) {
      console.error("Error adding/updating admin:", error);
      showMessage("Error: Unable to perform action", "red");
    }
  };
  

  const handleEditAdmin = (adminId) => {
    // Find the selected admin from the employees list
    const selectedAdmin = employees.find((employee) => employee._id === adminId);
    if (selectedAdmin) {
      // Populate the input fields with the selected admin's data
      setEmployeeData({
        username: selectedAdmin.username,
        password: "", // You may choose not to display or clear the password
        employeeData: { ...selectedAdmin.employeeData },
      });
      setSelectedAdminId(adminId);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    try {
      await deleteAdmin(adminId);
      fetchEmployees(); // Refresh the employee list after deleting an admin
      showMessage("Admin deleted successfully!", "green");
      // Clear the input fields after deletion
      setEmployeeData({
        username: "",
        password: "",
        employeeData: {
          firstName: "",
          lastName: "",
          position: "",
          location:"ADMIN",
          email: "",
        },
      });
      setSelectedAdminId(null); // Reset selectedAdminId after deletion
    } catch (error) {
      console.error("Error deleting admin:", error);
      showMessage("Error: Unable to delete employee", "red");
    }
  };



  return (
    <div id="adminsComponent">
      <h2 style={{textAlign:'right'}} >إدارة المدراء</h2>
      {message && <div style={{ color: messageColor }}>{message}</div>}
      
      <div>
        <label>
          Username:
          <input
            type="text"
            value={employeeData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={employeeData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
          />
        </label>
        <label>
          First Name:
          <input
            type="text"
            value={employeeData.employeeData.firstName}
            onChange={(e) => handleEmployeeDataChange("firstName", e.target.value)}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            value={employeeData.employeeData.lastName}
            onChange={(e) => handleEmployeeDataChange("lastName", e.target.value)}
          />
        </label>
        <label>
          Position:
          <input
            type="text"
            value={employeeData.employeeData.position}
            onChange={(e) => handleEmployeeDataChange("position", e.target.value)}
          />
        </label>
        <label>
        Location:
        <input
          type="text"
          value={employeeData.employeeData.location}
          onChange={(e) => handleEmployeeDataChange("location", e.target.value)}
        />
      </label>
        <label>
          Email:
          <input
            type="text"
            value={employeeData.employeeData.email}
            onChange={(e) => handleEmployeeDataChange("email", e.target.value)}
          />
        </label>
        {!isManager && (
        <Button style={{fontSize:'10px', width:'120px',fontWeight:'700'}} className="btn btn-success" onClick={handleAddEmployee}>
        {selectedAdminId ? "Update Admin" : "Add Admin"}
      </Button>
        )}
      </div>
      <h3>Admin List</h3>
      <table className='trolley-table '>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>User Name</th>
          <th>POSITION</th>
          <th>LOCATION</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <tr key={employee._id}>
          <td>  {employee.employeeData.firstName}</td> 
          <td>{employee.employeeData.lastName}</td>
          <td> ({employee.username})</td>
          <td> ({employee.employeeData.position})</td>
          <td> ({employee.employeeData.location})</td>
          <td> ({employee.employeeData.email})</td>
          {!isManager && (
          <td>
          
          <Button className="btn btn-success" onClick={() => handleEditAdmin(employee._id)}>Edit</Button>
          <Button className="btn btn-danger" onClick={() => handleDeleteAdmin(employee._id)}>Delete</Button>
          
          </td>
          )}
          </tr>
        ))}
      </tbody>
      </table>
    </div>
  );
};

export default AddAdminComponent;
