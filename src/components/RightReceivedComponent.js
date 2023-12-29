import React, { useEffect, useState } from 'react'
import RightTerms from './condition/RightTerms'
 

const RightReceivedComponent = ({ currentDate, currentTime, lastBalanceNumber, trolley, securityDepositText, remaining, user }) => {
  const [userLocation, setUserLocation] = useState('');

  useEffect(() => {
    // Retrieve the user's selected location from localStorage
    const storedLocation = localStorage.getItem('location');

    // Update the state with the retrieved location
    setUserLocation(storedLocation);
  }, []);
  return (
   <div className="A6Container"  >
 
<div id='Right-container'  className='frame-Right-container'>
<div className='logo-form'>
<p>مؤسسة أوفر بروكر 
<span>
<p>Overbroker Corporation</p>
<p>66666221</p>
</span>
</p>
<p className='right-receive-No'>Receive No 
<span >({ lastBalanceNumber})</span>
</p>


</div>
<h7>Date: {currentDate} التاريخ</h7>
<h7 >Time Out: {currentTime} :وقت المغادرة</h7>
<div>
<div>
<p>الموظف: {user && user.employeeData ? user.employeeData.firstName : ''}</p>
</div>
<span className='loc-form-2' >
<p style={{ backgroundColor: "yellow" }} className="m2-p">
LOC:  {userLocation ? userLocation  : "Location A"} <span>موقع المغادرة</span>
</p>
 
</span>
<div className='loc-form-2' >
<p  >Loc: 12</p>
<p  >Loc: 08</p>
<p >Loc: 04</p>
<p >التوصيل</p>
</div>
</div>
<h6>Trolley No.
{trolley &&
  <span>( {trolley.trolleyNumber} )</span>}

<span>رقم العربة</span> </h6>
<h7 className='text-right'>Price:   2 BD <span> المبلغ </span> </h7>
<div className='r-secur-deposit'>
<h7>Security Deposit: <span>{ securityDepositText} BD</span></h7>
<h7>Remaining Amount : <span>{ remaining} BD</span> </h7>

 
<RightTerms/>
 
</div>

 
</div>
</div> 
  )
}

export default RightReceivedComponent