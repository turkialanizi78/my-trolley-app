/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import { getAllTrolleys, updateTrolley, deleteTrolley, getAllTrolleyNumbers, addTrolleyNumber, updateTrolleyNumber, deleteTrolleyNumber } from '../../services/api';
import TrolleyTable from './TrolleyTable';
import TrolleyNumberTable from './TrolleyNumberTable';
import { Button } from 'react-bootstrap';
 
import { Reception3 } from 'react-bootstrap-icons';
import ProtectedRoutHook from '../../auth/ProtectedRoutHook';
import EmployeeManagement from './EmployeeManagement ';
import AdminUserLogs from './AdminUserLogs';
import AddAdminComponent from './AddAdminComponent';

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


  const [selectedPage, setSelectedPage] = useState('dashPoardPage');

  const handlePageChange = (page) => {
    setSelectedPage(page);
  };

  const renderPageContent = () => {
    switch (selectedPage) {
      case 'dashPoardPage':
      return  <TrolleyTable trolleys={trolleys} onDelete={deleteExistingTrolley} onUpdate={updateExistingTrolley} />
      case 'trolleyNumber':
      return  <TrolleyNumberTable trolleyNumbers={trolleyNumbers} onDelete={deleteExistingTrolleyNumber} onUpdate={updateExistingTrolleyNumber} onAdd ={addNewTrolleyNumber} />
      case "admins":
      return <AddAdminComponent/>
      case 'employee':
      return  <EmployeeManagement />
      case 'logs':
      return  <AdminUserLogs />
        
      // Add cases for other pages
      default:
        return null;
    }
  };


  return (
    <div>
      <Navbar />
      <div className='Admincontainer'>
    
      {!isManager && (
     <div className='buttonAdminComponent'>
      
     <Button onClick={() => handlePageChange('logs')}  className='btn btn-danger' style={{width:'auto',margin:'5px' , fontSize:'1rem'}} > <Reception3 className="ic" size="20"/> LOGS </Button>
     <Button onClick={() => handlePageChange('dashPoardPage')}  className='btn btn-danger' style={{width:'auto' ,margin:'5px', fontSize:'1rem'}} > Revenue </Button>
     <Button onClick={() => handlePageChange('trolleyNumber')}  className='btn btn-danger' style={{width:'auto' ,margin:'5px', fontSize:'1rem'}} > Trolley's </Button>
     <Button onClick={() => handlePageChange('admins')}  className='btn btn-danger' style={{width:'auto' ,margin:'5px', fontSize:'1rem'}} > Admin's  </Button>
     <Button onClick={() => handlePageChange('employee')}  className='btn btn-danger' style={{width:'auto' ,margin:'5px', fontSize:'1rem'}} > Employess </Button>
 
    
     </div>
      )}
     
      {renderPageContent()}

      
      </div>
   </div>
  );
};

export default AdminComponent;
