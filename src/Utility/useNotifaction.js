import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//to make notifactio to any componentet
const notify = (msg) => {
  toast.success(msg, {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

const notifyError = (msg) => {
  toast.error(msg, {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};

export { notify, notifyError };
