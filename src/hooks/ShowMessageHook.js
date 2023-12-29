import { useState } from "react";

 

const ShowMessageHook = () => {
    const [message, setMessage] = useState(null);
    const [messageColor, setMessageColor] = useState(null);

    const showMessage = (text, color) => {
        setMessage(text);
        setMessageColor(color);
        // Clear the message after a timeout (e.g., 5 seconds)
        setTimeout(() => {
          setMessage(null);
          setMessageColor(null);
        }, 5000);
      };
return [message,messageColor,showMessage]
    }


export default ShowMessageHook