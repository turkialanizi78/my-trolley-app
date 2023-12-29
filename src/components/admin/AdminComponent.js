/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import { getAllTrolleys, updateTrolley, deleteTrolley, getAllTrolleyNumbers, addTrolleyNumber, updateTrolleyNumber, deleteTrolleyNumber } from '../../services/api';
import TrolleyTable from './TrolleyTable';
import TrolleyNumberTable from './TrolleyNumberTable';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Reception3 } from 'react-bootstrap-icons';
import ProtectedRoutHook from '../../auth/ProtectedRoutHook';

const AdminComponent = () => {
  const [trolleys, setTrolleys] = useState([]);
  const [trolleyNumbers, setTrolleyNumbers] = useState([]);
  const [ isUser, isAdmin,isManager] = ProtectedRoutHook();
  useEffect(() => {
    // Fetch initial data when the component mounts
    fetchTrolleys();
    fetchTrolleyNumbers();
  }, []);

  const fetchTrolleys = async () => {
    try {
      const response = await getAllTrolleys();
      setTrolleys(response.data.trolleys);
    } catch (error) {
      console.error('Error fetching trolleys:', error);
    }
  };


  const updateExistingTrolley = async (balanceNumber, updatedTrolleyData) => {
    try {
      console.log('Updating Trolley:', updatedTrolleyData);
      await updateTrolley(balanceNumber, updatedTrolleyData);
      // After updating, fetch the updated list
      fetchTrolleys();
    } catch (error) {
      console.error('Error updating trolley:', error);
    }
  };
  
  const deleteExistingTrolley = async (balanceNumber) => {
    try {
      await deleteTrolley(balanceNumber);
      // After deleting, fetch the updated list
      fetchTrolleys();
    } catch (error) {
      console.error('Error deleting trolley:', error);
    }
  };

  const fetchTrolleyNumbers = async () => {
    try {
      const response = await getAllTrolleyNumbers();
      setTrolleyNumbers(response.data.trolleyNumbers);
    } catch (error) {
      console.error('Error fetching trolley numbers:', error);
    }
  };

  const addNewTrolleyNumber = async (newTrolleyNumberData) => {
    try {
      await addTrolleyNumber(newTrolleyNumberData);
      // After adding, fetch the updated list
      fetchTrolleyNumbers();
    } catch (error) {
      console.error('Error adding new trolley number:', error);
    }
  };

  const updateExistingTrolleyNumber = async (trolleyNumber, updatedTrolleyNumberData) => {
    try {
      await updateTrolleyNumber(trolleyNumber, updatedTrolleyNumberData);
      // After updating, fetch the updated list
      fetchTrolleyNumbers();
    } catch (error) {
      console.error('Error updating trolley number:', error);
    }
  };

  const deleteExistingTrolleyNumber = async (trolleyNumber) => {
    try {
      await deleteTrolleyNumber(trolleyNumber);
      // After deleting, fetch the updated list
      fetchTrolleyNumbers();
    } catch (error) {
      console.error('Error deleting trolley number:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className='Admincontainer'>
         {/* Render components, forms, or tables to display and interact with trolleys and trolley numbers */}
      {/* Example: */}
      {!isManager && (
      <Link to={'/admin/user-logs'}><Button className='btn btn-danger' style={{width:'auto', marginTop:'20px',fontWeight:'900'}} > <Reception3 className="ic" size="20"/> USER LOGS</Button></Link> 
      )}
      <TrolleyTable trolleys={trolleys} onDelete={deleteExistingTrolley} onUpdate={updateExistingTrolley} />
      <TrolleyNumberTable trolleyNumbers={trolleyNumbers} onDelete={deleteExistingTrolleyNumber} onUpdate={updateExistingTrolleyNumber} onAdd ={addNewTrolleyNumber} />
    
      
      </div>
   </div>
  );
};

export default AdminComponent;
