import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTrolleyNumberByNumber } from '../services/api';
import TrolleyForm from './TrolleyForm';
import Navbar from './Navbar';

const TrolleyDetails = () => {
  const { id } = useParams();
  const [trolley, setTrolley] = useState(null);

  useEffect(() => {
    const fetchTrolley = async () => {
      try {
        const response = await getTrolleyNumberByNumber(id);
        console.log('API Response:', response.data); // Log the response to the console
        setTrolley(response.data); // Set trolley to the response data
      } catch (error) {
        console.error('Error fetching trolley details:', error);
      }
    };

    fetchTrolley();
  }, [id]);

  return (
    <div >
    <div className='print-content'>
    <Navbar/>
      {trolley && (
        <div className='print-content' style={{display:'flex',padding:'4px'}}>
          <p >Trolley Number: {trolley.trolleyNumber}   <span style={{ color: trolley.isOutside ? 'red' : 'green' }}>{trolley.isOutside ? 'Trolley is outside' : 'Trolley is available'}</span></p>
        
          {/* Display other details based on the fetched trolley data */}
        </div>
        
      )}

      </div>
      <TrolleyForm trolley ={trolley}/>
  
    </div>
  );
};

export default TrolleyDetails;
