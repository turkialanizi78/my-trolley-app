/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { deleteLogsByDate, getAdminUserLogs } from '../../services/api';
import './AdminUserLogs.css'; // Import the CSS file
import Navbar from '../Navbar';
import {  Button, Pagination } from "react-bootstrap";
const AdminUserLogs = () => {
  const [userLogs, setUserLogs] = useState([]);
  const [sortedLogs, setSortedLogs] = useState([]);
 
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    // Fetch admin user logs when the component mounts
    fetchAdminUserLogs();
  }, [selectedDate]);

  // Fetch admin user logs function
  const fetchAdminUserLogs = async () => {
    try {
      const response = await getAdminUserLogs(selectedDate);

      if (response && Array.isArray(response)) {
        setUserLogs(response);
        setSortedLogs([...response]);
      } else {
        console.error('Error fetching admin user logs: Data structure is unexpected');
      }
    } catch (error) {
      console.error('Error fetching admin user logs:', error);
    }
  };
 // State for pagination
 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage = 20;

 // Calculate the index of the first and last item of the current page
 const indexOfLastItem = currentPage * itemsPerPage;
 const indexOfFirstItem = indexOfLastItem - itemsPerPage;
 const currentLogs = sortedLogs.slice(indexOfFirstItem, indexOfLastItem);

 // Update the current page
 const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // Determine whether to show pagination
 const showPagination = sortedLogs.length > itemsPerPage;

 const handleDeleteLogsByDate = async () => {
  try {
    await deleteLogsByDate(selectedDate);
    // After deletion, you may want to fetch the updated logs
    fetchAdminUserLogs();
  } catch (error) {
    console.error('Error deleting admin user logs by date:', error);
  }
};




  return (
    <div>
    <Navbar/>
    <div className="admin-user-logs">
      <h2>Admin User Logs</h2>
    
      <div className='date-picker-container'>
        <label htmlFor="customDatePicker">Filter By Date:</label>
        <div className=' className="custom-date-picker"'>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        </div>
           {/* Button to delete logs by date */}
           <Button onClick={handleDeleteLogsByDate}>Delete Logs by Date</Button>
      </div>
      <ul>
        {currentLogs.map((log) => (
          <li key={log._id} className="log-entry">
            {`${log.employeeId?.username || 'Unknown User'} - ${log.action || 'Unknown Action'} - ${new Date(log.timestamp).toLocaleString()}`}
            {log.details && (
              <div className="log-details">
                {Object.entries(log.details).map(([key, value]) => (
                  <div key={key}>{`${key}: ${value}`}</div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
      {/* Pagination */}
      {showPagination && (
        <Pagination className="justify-content-center">
          {Array.from({ length: Math.ceil(sortedLogs.length / itemsPerPage) }).map((_, index) => (
            <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </div>
    </div>
  );
};

export default AdminUserLogs;
