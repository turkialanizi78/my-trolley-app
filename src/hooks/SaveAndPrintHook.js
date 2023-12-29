import { useState } from "react";
import { addTrolley } from "../services/api";
import { notify } from "../Utility/useNotifaction";

 

const SaveAndPrintHook = ({trolley}) => {
    const [lastBalanceNumber, setLastBalanceNumber] = useState(1);
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [securityDepositText, setSecurityDepositText] = useState('');
    const [customerNameText, setCustomerNameText] = useState('');
   const [remaining , setRemining]=useState('');

    const handleSaveAndPrintClick = async () => {
        try {
          // Update the fields based on your form
          const newTrolleyData = {
            balanceNumber: lastBalanceNumber,
            isOutside: true,
            departureTime:currentDate,
            trolleyNumber:trolley.trolleyNumber,
            securityDeposit:securityDepositText,
            //  returnTime : "2023-01-02T12:00:00.000Z",
              pickupLocation : "Location A",
           deliveryLocation : "Location B",
           rentalAmount : 2,
           remainingAmount: remaining,
           balancePrintDate:currentDate,
           customer: customerNameText,
            // Add other fields from your form
          };
    
          // Add validation or checks if needed
          await addTrolley(newTrolleyData); // Call the function to add a new trolley
          window.print();
    
          notify("You added data successfully.");
        } catch (error) {
          console.error('Error adding new trolley:', error);
          if (error.response) {
            console.error('Server error response:', error.response.data);
          }
        }
      };
}

export default SaveAndPrintHook