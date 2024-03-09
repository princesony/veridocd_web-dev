import { createContext, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ToastContext = createContext();

export const ToastProvider = ({children}) => {

    const showSuccess = (message) => {
        toast.success(message, {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 1000
        });
    }

    const showWarning = (message) => {
        toast.warn(message, {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 1000
        });
    }

    const showError = (message) => {
        toast.error(message ?? "Something went wrong", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 1000
        });
    }

    return (
        <ToastContext.Provider value={{toast, showSuccess, showError, showWarning}}>
            {children}
            <ToastContainer/>
        </ToastContext.Provider>
    )
}

export const useToastProvider = () => {
    return useContext(ToastContext);
}