import React, { useState } from 'react';
import { Button, Pagination } from 'react-bootstrap';
import './TrolleyNumberTable.css'
import EmployeeManagement from './EmployeeManagement ';
import AddAdminComponent from './AddAdminComponent';
import ShowMessageHook from '../../hooks/ShowMessageHook';
const TrolleyNumberTable = ({ trolleyNumbers, onDelete, onUpdate, onAdd }) => {

  const [message,messageColor,showMessage] = ShowMessageHook();

  const [updatedData, setUpdatedData] = useState({
    // fields to update
    trolleyNumber: '',
    isOutside: false,
    // add other fields as needed
  });

  const handleUpdateInputChange = (field, value) => {
    setUpdatedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleUpdateClick = (trolleyNumber) => {
    onUpdate(trolleyNumber, updatedData);
    // Clear the updatedData state after updating
    setUpdatedData({
      trolleyNumber: '',
      isOutside: false,
      // add other fields as needed
    });
    showMessage("تم تعديل بيانات العربة بنجاح!", "green");
  };

  const handleAddClick = () => {
    // Perform validation or other checks if needed
    onAdd(updatedData);
    setUpdatedData({
      trolleyNumber: '',
      isOutside: false,
    });
    showMessage("تم إضافة العربة بنجاح!", "green");
  };


// State for pagination
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 12;

// Calculate the index of the first and last item of the current page
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentTrolleys = trolleyNumbers.slice(indexOfFirstItem, indexOfLastItem);

// Update the current page
const paginate = (pageNumber) => setCurrentPage(pageNumber);
 // Determine whether to show pagination
 const showPagination = trolleyNumbers.length > itemsPerPage;


  return (
    <div className='trolley-table-container  modal-1 '>
    <h2 className='title-admin-dash'>إدارة العربات</h2>
    <table className='trolley-table '>
      <thead>
        <tr>
          <th>Trolley Number</th>
          <th>Is Outside</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody className=''>
        {currentTrolleys.map((trolleyNumberItem) => (
          <tr key={trolleyNumberItem.trolleyNumber}>
            <td>{trolleyNumberItem.trolleyNumber}</td>
            <td>{trolleyNumberItem.isOutside ? 'Yes' : 'No'}</td>
            <td>
              <Button className='btn btn-success'
                onClick={() => {
                  const { trolleyNumber, isOutside } = trolleyNumberItem;
                  setUpdatedData({ trolleyNumber, isOutside });
                }}
              >
                Edit
              </Button>
              <Button className='btn btn-danger' onClick={() => onDelete(trolleyNumberItem.trolleyNumber)}>Delete</Button>
              {updatedData.trolleyNumber === trolleyNumberItem.trolleyNumber && (
                <div className='edit-modal'>
                  <label>
                    Is Outside:
                    <input
                    style={{height:'20px'}}
                      type="checkbox"
                      checked={updatedData.isOutside}
                      onChange={(e) => handleUpdateInputChange('isOutside', e.target.checked)}
                    />
                  </label>
                  <Button onClick={() => handleUpdateClick(trolleyNumberItem.trolleyNumber)}>
                    Save
                  </Button>
                  <Button className='cancel-button' onClick={() => setUpdatedData({})}>
                    Cancel
                  </Button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
     {/* Pagination */}
     {showPagination && (
      <Pagination className="justify-content-center">
        {Array.from({ length: Math.ceil(trolleyNumbers.length / itemsPerPage) }).map((_, index) => (
          <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    )}
    {/* Form for adding a new trolleyNumber */}
    <div >
    {message && <div style={{ color: messageColor }}>{message}</div>}
      <h3 className='title-admin-dash'>إضافة عربة جديدة</h3>
    <div className='add-trolley-form'>
    <label>
    رقم العربة:
    <input
      type="text"
      value={updatedData.trolleyNumber}
      onChange={(e) => handleUpdateInputChange('trolleyNumber', e.target.value)}
    />
  </label>
  <label>
    بالخارج:
    <input
    style={{height:'20px' }}
      type="checkbox"
      checked={updatedData.isOutside}
      onChange={(e) => handleUpdateInputChange('isOutside', e.target.checked)}
    />
  </label>
  <Button onClick={handleAddClick}>Add</Button>
    </div>
    </div>
    <div>
    <EmployeeManagement/>
    </div>

    <div className='add-admin-form'>
    <AddAdminComponent/>
    </div>
  </div>
);
};

export default TrolleyNumberTable;