/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { addEmployee, getAllEmployees, updateEmployee, deleteEmployee } from "../../services/api";
import ShowMessageHook from './../../hooks/ShowMessageHook';
import { Button } from "react-bootstrap";
import ProtectedRoutHook from "../../auth/ProtectedRoutHook";

const EmployeeManagement = () => {
  const [isAManager, setIsAManager] = useState(false);
  const [message,messageColor,showMessage] = ShowMessageHook();
  const [ isUser, isAdmin,isManager] = ProtectedRoutHook();
  const [employees, setEmployees] = useState([]);
  const[addPosition , setPosition] = useState('Operator');
  
  const [employeeData, setEmployeeData] = useState({
    username: "",
    password: "",
    isManager: isAManager,
    employeeData: {
      firstName: "",
      lastName: "",
      position: addPosition,
      location: "",
      email: "",
      
    },
  });

 

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null); // Track the selected employee for editing

  useEffect(() => {
    // Fetch employees when the component mounts
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getAllEmployees();
      setEmployees(response.data.employees);
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



  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    const newPosition = isChecked ? "Manager" : "Operator";
     
    handleEmployeeDataChange("position", newPosition);
    setIsAManager(isChecked); // Update isManager state
  };

  const handleAddEmployee = async () => {
    try {
      const updatedEmployeeData = {
        ...employeeData,
        isManager: isAManager, // Update isManager directly
        employeeData: {
          ...employeeData.employeeData,
        },
      };
  
      // If a new password is not provided, remove the 'password' field
      if (!updatedEmployeeData.password) {
        delete updatedEmployeeData.password;
      }
  
      if (selectedEmployeeId) {
        // If selectedEmployeeId is present, update the employee
        await updateEmployee(selectedEmployeeId, updatedEmployeeData);
        showMessage("Employee updated successfully!", "green");
      } else {
        // Otherwise, add a new employee
        await addEmployee(updatedEmployeeData);
        showMessage("Employee added successfully!", "green");
      }
  
      fetchEmployees(); // Refresh the employee list after adding/updating an employee
      setEmployeeData({
        username: "",
        password: "",
        isManager: isAManager,
        employeeData: {
          firstName: "",
          lastName: "",
          position: addPosition,
          location: "",
          email: "",
        },
      });
      setSelectedEmployeeId(null); // Reset selectedEmployeeId after adding/updating
    } catch (error) {
      console.error("Error adding/updating employee:", error);
      showMessage("Error: Unable to perform action", "red");
    }
  };
  

  const handleEditEmployee = (employeeId) => {
    // Find the selected employee from the employees list
    const selectedEmployee = employees.find((employee) => employee._id === employeeId);
    if (selectedEmployee) {
      // Populate the input fields with the selected employee's data
      setEmployeeData({
        username: selectedEmployee.username,
        password: "", // You may choose not to display or clear the password
        isManager: selectedEmployee.isManager,
        employeeData: {
          ...selectedEmployee.employeeData,
          
        },
      });
      setIsAManager(selectedEmployee.isManager); // Update isAManager state
      setSelectedEmployeeId(employeeId);
    }
  };
  
  

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await deleteEmployee(employeeId);
      fetchEmployees(); // Refresh the employee list after deleting an employee
      showMessage("Employee deleted successfully!", "green");
      // Clear the input fields after deletion
      setEmployeeData({
        username: "",
        password: "",
        isManager:isAManager,
        employeeData: {
          firstName: "",
          lastName: "",
          position: addPosition,
          location: "",
          email: "",
       
        },
      });
      setSelectedEmployeeId(null); // Reset selectedEmployeeId after deletion
    } catch (error) {
      console.error("Error deleting employee:", error);
      showMessage("Error: Unable to delete employee", "red");
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: 'right' }}>Employee Management</h2>
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
        disabled
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
        <label>
        Is Manager:
        <input
          type="checkbox"
          checked={isAManager}   
          onChange={handleCheckboxChange}
        />
      </label>
      
      {!isManager && (
        <Button style={{fontSize:'10px', width:'120px',fontWeight:'700'}} className="btn btn-success" onClick={handleAddEmployee}>
          {selectedEmployeeId ? "Update Employee" : "Add Employee"}
        </Button>
      )}
      </div>
      <h3>Employee List</h3>
      <table className='trolley-table'>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>User Name</th>
            <th>Position</th>
            <th>location</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.employeeData.firstName}</td>
              <td>{employee.employeeData.lastName}</td>
              <td>({employee.username})</td>
              <td>({employee.employeeData.position})</td>
              <td>({employee.employeeData.location})</td>
              <td>({employee.employeeData.email})</td>
              {!isManager && (
              <td>
                <Button className="btn btn-success" onClick={() => handleEditEmployee(employee._id)}>Edit</Button>
                <Button className="btn btn-danger" onClick={() => handleDeleteEmployee(employee._id)}>Delete</Button>
              </td>
              )};
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeManagement;
