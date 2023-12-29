/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import "./trolleyForm.css";
import {
  addTrolley,
  getAllTrolleys,
  getTrolleyNumberByNumber,
  getTrolleysByTrolleyNumber,
  logUserAction,
  updateTrolley,
  updateTrolleyNumber,
} from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOMServer from "react-dom/server";
import {
  faCreditCard,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import TermsCondition from "./condition/TermsCondition";
import { notify } from "../Utility/useNotifaction";
import { ToastContainer } from "react-toastify";
import RightTerms from "./condition/RightTerms";
import { useUser } from "../hooks/UserContext";
import { useNavigate } from "react-router-dom";
import RightReceivedComponent from "./RightReceivedComponent";
import { CartCheck, HandThumbsDown, HandThumbsUp, Printer, PrinterFill } from "react-bootstrap-icons";
const TrolleyForm = ({ trolley }) => {
  const [lastBalanceNumber, setLastBalanceNumber] = useState(1);
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [securityDepositText, setSecurityDepositText] = useState("");
  const [customerNameText, setCustomerNameText] = useState("");
  const [remaining, setRemining] = useState("");
  const rightContainerRef = useRef(null); // Create a ref for the 'Right-container'

  const [userLocation, setUserLocation] = useState('');

  useEffect(() => {
    // Retrieve the user's selected location from localStorage
    const storedLocation = localStorage.getItem('location');

    // Update the state with the retrieved location
    setUserLocation(storedLocation);
  }, []);
// console.log(trolley.trolleyNumber );

  const { user } = useUser();
  const navigate = useNavigate();
  const handlePrintClick = async () => {
    window.print();
    window.document.close();
    await logUserAction("قام بطباعة إيصال", {
      // Add specific details as needed
      page: window.location.pathname,
    });
  };
 
  const handleSaveClick = async () => {
    try {
      // Update the fields based on your form
      const newTrolleyData = {
        balanceNumber: lastBalanceNumber,
        isOutside: true,
        departureTime: currentDate,
        trolleyNumber: trolley.trolleyNumber,
        securityDeposit: securityDepositText,
        //  returnTime : "2023-01-02T12:00:00.000Z",
        pickupLocation:
        userLocation ? userLocation  : "Location A",
        deliveryLocation: userLocation ? userLocation : "Location B",
        rentalAmount: 2,
        remainingAmount: remaining,
        balancePrintDate: currentDate,
        customer: customerNameText,
        staff: user.employeeData.firstName,
        // Add other fields from your form
      };
      const locationUser = user ? user.employeeData.location : "ANKNOW...";
      // Add validation or checks if needed
      await addTrolley(newTrolleyData); // Call the function to add a new trolley
      // Optionally, you can reset the form or navigate to another page
      await logUserAction("قام بعملية تأجير عربة", {
        // Add specific details as needed
        page: window.location.pathname,
        Location: locationUser,
      });
      notify("You add data successfully.");
      // setTimeout(() => {
      //  navigate("/");

      // }, 1500);
    } catch (error) {
      console.error("Error adding new trolley:", error);
      // Log the detailed error response
      if (error.response) {
        console.error("Server error response:", error.response.data);
      }
    }
  };

  const handleSaveAndPrintClick = async () => {
    try {
      const response = await getAllTrolleys();
      const existingTrolleys = response.data.trolleys;

      // Check if the current trolley number already exists
      const isTrolleyExists = existingTrolleys.some(
        (t) => t.balanceNumber === trolley.balanceNumber
      );

      if (isTrolleyExists) {
        // Trolley already exists, you can choose to show a notification or handle it as needed
        notify("Trolley balance already saved.");

        return;
      }
      // Update the fields based on your form
      const newTrolleyData = {
        balanceNumber: lastBalanceNumber,
        isOutside: true,
        departureTime: currentDate,
        trolleyNumber: trolley.trolleyNumber,
        securityDeposit: securityDepositText,
        //  returnTime : "2023-01-02T12:00:00.000Z",
        pickupLocation:
        userLocation ? userLocation : "Location A",
        deliveryLocation: userLocation ? userLocation :"Location B",
        rentalAmount: 2,
        remainingAmount: remaining,
        balancePrintDate: currentDate,
        customer: customerNameText,
        staff: user.employeeData.firstName,
        // Add other fields from your form
      };

      // Add validation or checks if needed
      await addTrolley(newTrolleyData); // Call the function to add a new trolley
      // Open a new window or use a hidden iframe
      const printWindow = window.open("", "_blank");
      // Render the RightReceivedComponent as a string
      const rightComponentString = ReactDOMServer.renderToString(
        <RightReceivedComponent
          currentDate={currentDate}
          currentTime={currentTime}
          lastBalanceNumber={lastBalanceNumber}
          trolley={trolley}
          securityDepositText={securityDepositText}
          remaining={remaining}
          user={user}
        />
      );
      // Include the styles directly in the HTML content
      const styles = `
  <style>
  .frame-Right-container {
    /* Additional styles for the right container, if needed */
    display: grid;
    grid-template-columns: 1fr   ;
    padding: 0;
    margin-bottom: auto;
  }
  .right-receive-No input{
    border: none;
    width: 60px;
  }
  .loc-form-2{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}
.r-secur-deposit{
    display: grid;
    grid-template-columns: 1fr;
}
/* A6 Container Styles */
.A6Container {
  width: 105mm; /* A6 width in millimeters */
  height: 148mm; /* A6 height in millimeters */
  margin: 0 auto; /* Center the container horizontally */
  padding: 10mm; /* Add padding if needed */
  box-sizing: border-box; /* Include padding in the total width and height */
}

/* Additional styles if needed */
.A6Container p {
  font-size: 12px; /* Adjust font size as needed */
  line-height: 1.5; /* Adjust line height as needed */
}

 
  </style>
`;
      // Inject the rendered string into the new window
      printWindow.document.write(`
    <html>
      <head>
        <title>Print</title>
        ${styles}
      </head>
      <body>
        ${rightComponentString}
      </body>
    </html>
  `);

      // Trigger the print action
      printWindow.print();
      printWindow.document.close();

      notify("You added data successfully.");
      await logUserAction("تم تأجير عربة وطباعة ايصال", {
        // Add specific details as needed
        page: window.location.pathname,
      });
    } catch (error) {
      console.error("Error adding new trolley:", error);
      if (error.response) {
        console.error("Server error response:", error.response.data);
      }
    }
  };

  const handleSecurityDepositChange = (event) => {
    const input = event.target.value;
    if (!isNaN(input) || input.trim() === "") {
      // If input is a number or an empty string, update the state
      setSecurityDepositText(input);
      setRemining(input !== "" ? parseInt(input, 10) - 2 : ""); // Calculate remaining
    }
  };

  const handleCustomerNameChange = (event) => {
    setCustomerNameText(event.target.value);
  };

  useEffect(() => {
    const fetchLastBalanceNumber = async () => {
      try {
        const response = await getAllTrolleys();
        const trolleys = response.data.trolleys;

        if (trolleys.length > 0) {
          // Get the last trolley and extract its balanceNumber
          const lastTrolley = trolleys[trolleys.length - 1];
          const incrementedBalanceNumber =
            parseInt(lastTrolley.balanceNumber, 10) + 1;
          setLastBalanceNumber(incrementedBalanceNumber);
        } else {
          // If no trolleys, set default to 1
          setLastBalanceNumber(1);
        }
      } catch (error) {
        console.error("Error fetching last balanceNumber:", error);
      }
    };

    fetchLastBalanceNumber();

    // Get current date and time
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const hourss = String(today.getHours()).padStart(2, "0");
    const minutess = String(today.getMinutes()).padStart(2, "0");
    const seconds = String(today.getSeconds()).padStart(2, "0");

    // Format the date and time string as 'YYYY-MM-DD HH:mm:ss'
    const formattedDateTime = `${yyyy}-${mm}-${dd} ${hourss}:${minutess}:${seconds}`;

    setCurrentDate(formattedDateTime);

    // Get current time
    const hours = today.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = String(today.getMinutes()).padStart(2, "0");
    const ampm = today.getHours() >= 12 ? "PM" : "AM";
    setCurrentTime(`${hours}:${minutes} ${ampm}`);
  }, []);
  const handleLastBalanceChange = (event) => {
    setLastBalanceNumber(event.target.value);
  };
  const locationUser = userLocation ? userLocation :"ANKNOW...";
 

  const handleJustRetern = async () => {
    try {
      // Fetch trolleys by trolley number
      const response = await getTrolleysByTrolleyNumber(trolley.trolleyNumber);
      const trolleys = response.data;
  
      // Filter trolleys where isOutside is true
      const outsideTrolleys = trolleys.filter((t) => t.trolleyNumberInfo.isOutside === true);
  
      // Update the first matching trolley (assuming there is only one)
      if (outsideTrolleys.length > 0) {
        const relatedTrolley = outsideTrolleys[0];
  
        // Create the updatedTrolleyData object without rentalAmount and remainingAmount
        const updatedTrolleyData = {
          trolleyNumber: trolley.trolleyNumber,
          isOutside: false,
          deliveryLocation: userLocation ? userLocation : "Location B",
          returnTime: new Date().toISOString(), // Set returnTime to the current date and time
          // Exclude rentalAmount and remainingAmount fields
        };
  
        // Call the API to update the trolley
        const updateResponse = await updateTrolley(relatedTrolley.balanceNumber, updatedTrolleyData);
        console.log("Second Update API Response:", updateResponse);
  
        await logUserAction("إرجاع عربة من الزبون", {
          // Add specific details as needed
          page: window.location.pathname,
          Location: locationUser,

        });
        // Display a notification or perform other actions as needed
        notify(" Trolley Returned successfully.");
  
        // Optionally, you can set the related trolleys state to the updated trolley
        setRelatedTrolleys([updatedTrolleyData]);
      }
    } catch (error) {
      console.error("Error updating trolley:", error);
      // Log the detailed error response
      if (error.response) {
        console.error("Server error response:", error.response.data);
      }
    }
  };
  



  const [relatedTrolleys, setRelatedTrolleys] = useState([]);

  const handleFetchRelatedTrolleys = async () => {
    try {
      // Check if trolley and trolley.trolleyNumberInfo are defined
      if (!trolley || !trolley.trolleyNumber) {
        console.error("Error: Trolley or trolley number information is missing.");
        return;
      }
  
      // Fetch trolleys by trolley number
      const response = await getTrolleysByTrolleyNumber(trolley.trolleyNumber);
      const trolleys = response.data;
  
      // Filter trolleys where isOutside is true
      const outsideTrolleys = trolleys.filter((t) => t.trolleyNumberInfo.isOutside === true);
  
      // Update the first matching trolley (assuming there is only one)
      if (outsideTrolleys.length > 0) {
        const relatedTrolley = outsideTrolleys[0];
  
        // Calculate the new values
        const newRentalAmount = parseFloat(relatedTrolley.rentalAmount) + parseFloat(relatedTrolley.remainingAmount);
        const newRemaining = 0;
  
        // Update the trolley with the new values
        const updatedTrolleyData = {
          trolleyNumber: trolley.trolleyNumber,
          rentalAmount: isNaN(newRentalAmount) ? 0 : newRentalAmount,
          remainingAmount: newRemaining,
          deliveryLocation: userLocation ? userLocation : "Location B",
          isOutside: false,
          returnTime:new Date().toISOString(), // Set returnTime to the current date and time
        };
  
       // Ask for confirmation before updating
      const confirmed = window.confirm("Are you sure you want to update the trolley?");
      
      if (confirmed) {
        // Call the API to update the trolley
        const updateResponse = await updateTrolley(relatedTrolley.balanceNumber, updatedTrolleyData);
        console.log("API Response:", updateResponse);
        await logUserAction("عربة غير مرجعة", {
          // Add specific details as needed
          page: window.location.pathname,
          Location: locationUser,
          action:'تم الإحتفاظ بالتأمين',
          TotalAmount:isNaN(newRentalAmount) ? 0 : newRentalAmount.toFixed(2) + "BHD",

        });
        // Display a notification or perform other actions as needed
        notify("Trolley updated successfully.");

        // Optionally, you can set the related trolleys state to the updated trolley
        setRelatedTrolleys([updatedTrolleyData]);
      } else {
        // Handle the case where the user cancels the update
        console.log("Trolley update canceled by user.");
      }
    }
  } catch (error) {
    console.error("Error updating trolley:", error);
    // Log the detailed error response
    if (error.response) {
      console.error("Server error response:", error.response.data);
    }
  }
};
  
  
  
  
 
  return (
    <div>
      <div className="print-content container btn-container">
       
        <Button onClick={handleJustRetern} className="btn btn-succes">
        <HandThumbsUp className="ic" />
          Return In
        </Button>
      
        <Button className="btn btn-danger" 
        onClick={handleFetchRelatedTrolleys}

        >
        <HandThumbsDown className="ic" />
        Not Return
        </Button>
        <Button aria-label="Print"  className="btn btn-dark" onClick={handlePrintClick}>
        <Printer className="ic" />
          Print All
        </Button>
        <Button
        className="btn btn-dark"
        onClick={handleSaveClick}
        disabled={trolley && trolley.isOutside}
      >
      <CartCheck className="ic" />
        Just Save
      </Button>
        <Button
          className="btn btn-success"
          onClick={handleSaveAndPrintClick}
          disabled={trolley && trolley.isOutside}
        >
        <PrinterFill className="ic" />
          Save and Print
        </Button>


      </div>

      <div className="grid-frame-container">
        <div id="Form-Container-middle">
          <div className="logo-form">
            <p>
              مؤسسة أوفر بروكر
              <span>
                <p>Overbroker Corporation</p>
                <p>66666221</p>
              </span>
            </p>
            <p className="recive-no">
              Receive No{" "}
              <input
                type="text"
                value={lastBalanceNumber}
                onChange={handleLastBalanceChange}
              ></input>
              <span className="loc-form">
                <p style={{ backgroundColor: "yellow" }} className="m2-p">
                LOC:  {userLocation ? userLocation  : "Location A"}
                </p>
                <p className="m2-p"></p>
                <p className="m2-p"></p>
                <p className="m2-p">موقع</p>
              </span>
              <p>الموظف: {user.employeeData.firstName}</p>
            </p>
          </div>
          {trolley &&
            trolley.trolleyNumber &&
            trolley.isOutside !== undefined && (
              <div className="date-filed">
                <h5>Date: {currentDate} التاريخ</h5>
                <h6>
                  Trolley No.
                  <span>( {trolley.trolleyNumber} )</span>
                  <span>رقم العربة</span>
                </h6>
              </div>
            )}
          <div className="text-center customerName-filed">
            <h2>Name</h2>
            <input
              type="text"
              placeholder="Customer Name"
              value={customerNameText}
              onChange={(e) => handleCustomerNameChange(e)}
            />
            <h2>:إسم الزبون</h2>
          </div>
          <h7 className="text-left">Time Out: {currentTime} :وقت المغادرة</h7>
          <h7 className="text-left">
            Time In: .................. :وقت الإرجاع
          </h7>
          <h2 className="text-right">
            Price: <FontAwesomeIcon icon={faShoppingCart} /> 2 BD{" "}
            <span> المبلغ </span>{" "}
          </h2>
          <div className="secur-deposit">
            <h5>
              Security Deposit: <FontAwesomeIcon icon={faCreditCard} />
            </h5>
            <input
              type="text"
              placeholder=" BHD"
              value={securityDepositText}
              onChange={(e) => handleSecurityDepositChange(e)}
            />
            <span> BHD </span>
            <h5>
              {" "}
              <FontAwesomeIcon icon={faCreditCard} /> وديعة الضمان{" "}
            </h5>
          </div>
          <div className="returnAmount">
            <h5>Remaining </h5>
            <input
              type="text"
              placeholder="R Amount"
              value={remaining}
              onChange={(e) => setRemining(e.target.value)}
              readOnly
            />
            <h5>BD</h5>
          </div>
          <div>
            <h6 className="text-center mt-50">
              Customer
              Signature:.....................................................................
              توقيع الزبون
            </h6>
          </div>

          <TermsCondition />
        </div>

        <div style={{display:'none'}}>
          {/* Rightn Received */}
          <RightReceivedComponent
            currentDate={currentDate}
            currentTime={currentTime}
            lastBalanceNumber={lastBalanceNumber}
            trolley={trolley}
            securityDepositText={securityDepositText}
            remaining={remaining}
            user={user}
          />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default TrolleyForm;
