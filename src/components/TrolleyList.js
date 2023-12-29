// TrolleyList.js
import React, { useEffect, useState } from 'react';
import { getAllTrolleyNumbers } from '../services/api';
import './trolley.css';
import pic from '../images/pic.png';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import {  Pagination } from 'react-bootstrap';

const TrolleyList = () => {
  const [trolleys, setTrolleys] = useState([]);

  useEffect(() => {
    const fetchTrolleys = async () => {
      try {
        const response = await getAllTrolleyNumbers();
        setTrolleys(response.data.trolleyNumbers);
      } catch (error) {
        console.error('Error fetching trolleys:', error);
      }
    };

    fetchTrolleys();
  }, []);


   // State for pagination
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 24;
 
   // Calculate the index of the first and last item of the current page
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentTrolleys = trolleys.slice(indexOfFirstItem, indexOfLastItem);
 
   // Update the current page
   const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // Determine whether to show pagination
  const showPagination = trolleys.length > itemsPerPage;
  return (
    <div className='print-content'>
      <Navbar />
      <div className='container'>
        <h1 className='trolyTitle'>Trolley List</h1>
        <div className='trolleyList'>
          {currentTrolleys.map((trolley) => (
            <Link key={trolley._id} to={`/trolleys/${trolley.trolleyNumber}`}>
              <div className={`trolleyItem `}>
                <img className='trolly-image' src={pic} alt='pic' />
                <h1 className={`numTrolly ${trolley.isOutside ? 'outsideStyle' : ''}`}>{trolley.trolleyNumber}</h1>
              </div>
            </Link>
          ))}
        </div>
         {/* Pagination */}
      {showPagination && (
        <Pagination className='justify-content-center'>
          {Array.from({ length: Math.ceil(trolleys.length / itemsPerPage) }).map((_, index) => (
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

export default TrolleyList;
