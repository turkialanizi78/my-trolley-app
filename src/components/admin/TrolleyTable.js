/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TrolleyTable.css'
import { Button, Pagination } from "react-bootstrap";
import { useUser } from "../../hooks/UserContext";
import   { useReactToPrint } from "react-to-print";
import ProtectedRoutHook from "../../auth/ProtectedRoutHook";
import './TrolleyTable.css'
const TrolleyTable = ({ trolleys,  onDelete, onUpdate }, ref) => {
  const [ isUser, isAdmin,isManager] = ProtectedRoutHook();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  const { user } = useUser();
 
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [pickupLocationFilter, setPickupLocationFilter] = useState("");
  const [stafFilter, setStafFilter] = useState("");
  const uniqueEmployeeNames = new Set();

  trolleys.forEach((trolley) => {
    uniqueEmployeeNames.add(trolley.staff);
  });
  const uniqueEmployeesArray = Array.from(uniqueEmployeeNames);

  
  const [updatedData, setUpdatedData] = useState({
    isOutside: true,
    trolleyNumber: "",
    returnTime: null, // Use null initially
    deliveryLocation: user ? user.employeeData.location : null,
    // Add other fields as needed
  });

  const [selectedTrolley, setSelectedTrolley] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatAsMoney = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BHD', // You can adjust the currency code as needed
    }).format(amount);
  };


  const formatDate = (dateString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
  
    return new Intl.DateTimeFormat("en-GB", options).format(new Date(dateString));
  };

  const handleUpdateInputChange = (field, value) => {
    setUpdatedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  
    // Update startDate and endDate when the departureTime is changed
    if (field === 'departureTime') {
      setStartDate(value);
      setEndDate(null); // Reset endDate when startDate changes
    }
  };

  const handleUpdateClick = (trolley) => {
    setSelectedTrolley(trolley);
    setUpdatedData({
      isOutside: trolley.isOutside,
      trolleyNumber: trolley.trolleyNumberInfo.trolleyNumber,
      returnTime: trolley.returnTime ? new Date(trolley.returnTime) : null, // Parse returnTime to Date
      deliveryLocation : user ? user.employeeData.location : null,
      // Add other fields as needed
    });
    setIsModalOpen(true);
  };

  const handleSaveClick = () => {
    const {   trolleyNumber, returnTime } = updatedData;
 // Default isOutside to false if it's not checked
    const isOutside = updatedData.isOutside || false;
    if ( !trolleyNumber) {
      console.error("isOutside and trolleyNumber are required fields");
      return;
    }

  

    const updatedDataForServer = {
      isOutside,
      trolleyNumber,
      returnTime: returnTime ? returnTime.toISOString() : null, // Convert Date to string for server
      deliveryLocation : user ? user.employeeData.location : null,
      // Add other required fields as needed
    };
  
    onUpdate(selectedTrolley.balanceNumber, updatedDataForServer);
  
    setUpdatedData({
      isOutside: true,
      trolleyNumber: "",
      returnTime: null,
      deliveryLocation:user ? user.employeeData.location: null,
      // Add other fields as needed
    });

    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };


   // State for pagination
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 20;
 
   // Calculate the index of the first and last item of the current page
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  

  
   // Update the current page
   const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // Determine whether to show pagination
  
  const filteredTrolleys = trolleys.filter((trolley) => {

    if (pickupLocationFilter && !trolley.pickupLocation.toLowerCase().includes(pickupLocationFilter.toLowerCase())) {
      return false;
    }
    if (stafFilter && !trolley.staff.toLowerCase().includes(stafFilter.toLowerCase())) {
      return false;
    }
    if (!startDate && !endDate) {
      return true; // No date filter applied
    }
   
    const departureTime = new Date(trolley.departureTime);
  
    if (startDate && endDate) {
      return departureTime >= startDate && departureTime <= endDate;
    }
  
    if (startDate) {
      return departureTime >= startDate;
    }
  
    if (endDate) {
      return departureTime <= endDate;
    }

    return true;
  });
  const rentalAmountSubtotal = filteredTrolleys.reduce((acc, trolley) => acc + trolley.rentalAmount, 0);
  const currentTrolleys = filteredTrolleys.slice(indexOfFirstItem, indexOfLastItem);
  const showPagination = filteredTrolleys.length > itemsPerPage;


  return (
    <div className="">
      <h2 className="title-admin-dash">إدارة الارصدة</h2>
<div id="filterTrolleyByDate" >
<div className="filterTrolley-Start">
<label>Start Date:</label>
<DatePicker
  selected={startDate}
  onChange={(date) => setStartDate(date)}
  dateFormat="P"
/>
</div>
<div className="filterTrolley-End">
<label>End Date:</label>
<DatePicker
  selected={endDate}
  onChange={(date) => setEndDate(date)}
  dateFormat="P"
/>
</div>

<div>
<label>Pickup Location:</label>
<div><input className="form-control" 
type="text"
value={pickupLocationFilter}
onChange={(e) => setPickupLocationFilter(e.target.value)}
/></div>
</div>

<div>
<label>By STAFF Name:</label>
<div>
<select
className="form-select"
  value={stafFilter}
  onChange={(e) => setStafFilter(e.target.value)}
>
  <option  value="">اختر موظفًا</option>
  {uniqueEmployeesArray.map((employee, index) => (
    <option key={index} value={employee}>
      {employee}
    </option>
  ))}
</select>

</div>

</div>

</div>
<button onClick={handlePrint} className="print-button">Print Report</button>
<table ref={componentRef} className="print-table">
        <thead>
          <tr>
            <th>Balance Number</th>
            <th>trolley Number</th>
            <th>STAFF</th>
            <th>Deposit</th>
            <th>rental Amount</th>
            <th>remaining</th>
            <th>Departure Time</th>
            <th>Return Time</th>
            <th>Customer</th>
            <th>Pickup Location</th>
             <th>Delivery Location</th> 
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTrolleys.map((trolley) => (
            <tr key={trolley.balanceNumber}>
              <td>{trolley.balanceNumber}</td>
              <td>{trolley.trolleyNumberInfo.trolleyNumber}</td>
              <td>{trolley.staff}</td>
              <td>{formatAsMoney(trolley.securityDeposit)}</td>
              <td>{formatAsMoney(trolley.rentalAmount)}</td>
              <td>{formatAsMoney(trolley.remainingAmount)}</td>
              <td>{formatDate(trolley.departureTime)}</td>
              <td>{formatDate(trolley.returnTime)}</td>
              <td>{trolley.customer}</td>
              <td>{trolley.pickupLocation}</td>
               <td>{trolley.deliveryLocation}</td> 
               {!isManager && (
              <td>
                <Button className="btn btn-success" onClick={() => handleUpdateClick(trolley)}>
                  Update
                </Button>
                <Button className="btn btn-danger" onClick={() => onDelete(trolley.balanceNumber)}>
                  Delete
                </Button>
                {/* Render a modal for updating */}
                {isModalOpen && selectedTrolley === trolley && (
                  <div>
                    <label>
                      Is Outside:
                      <input
                        type="checkbox"
                        checked={updatedData.isOutside}
                        onChange={(e) =>
                          handleUpdateInputChange("isOutside", e.target.checked)
                        }
                      />
                    </label>
                    
                    <label>
                      Return Time:
                      <DatePicker
                        selected={updatedData.returnTime}
                        onChange={(date) => handleUpdateInputChange('returnTime', date)}
                        showTimeSelect
                        dateFormat="Pp"
                      />
                    </label>
                    <label>
                    delivery Location:
                    <input
                  
                      type="text"
                      value={updatedData.deliveryLocation}
                      onChange={(e) =>
                        handleUpdateInputChange("deliveryLocation", e.target.value)
                      }
                    />
                  </label>
                    {/* Add other input fields as needed */}
                    <Button onClick={handleSaveClick}>Save</Button>
                    <Button onClick={handleModalClose}>Cancel</Button>
                  </div>
                )}
              </td>
               )}
            </tr>
          ))}
           {/* Add a row for the rentalAmount subtotal */}
           <tr>
           <td colSpan="2"></td>
           <td style={{color:'green'}} colSpan="2">Rental Amount Subtotal:</td>
           <td style={{color:'green',fontWeight:900}}>{formatAsMoney(rentalAmountSubtotal)}</td>
           
           <td colSpan="4"></td>
        
           <td></td>
         </tr>
        </tbody>
      </table>

           {/* Pagination */}
      {showPagination && (
        <Pagination className="justify-content-center" >
          {Array.from({ length: Math.ceil(trolleys.length / itemsPerPage) }).map((_, index) => (
            <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </div>
  );
};

export default TrolleyTable;
