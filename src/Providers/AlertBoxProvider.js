import { useContext, createContext, useState, createRef } from "react";
import AlertBox from './../Elements/AlertBox/AlertBox';


const AlertBoxContext = createContext();

const submitRef = createRef();
const cancelRef = createRef();

export const AlertBoxProvider = ({children}) => {

    const [show, setShow] = useState(false);
    const [data, setData] = useState({
        message: '',
        title: '',
        submitLabel: null
    });

    const showDialog = ({title, message, submitLabel}) => {
        setData({
            message: message ?? '',
            title: title ?? '',
            submitLabel: submitLabel
        });
        setShow(true);
    }

    return (<AlertBoxContext.Provider value={{show, setShow, showDialog,
      submitRef, cancelRef}}>
        <AlertBox show={show} title={data.title} cancelRef={cancelRef}
          submitRef={submitRef} message={data.message}
            submitLabel={data.submitLabel}/>
        {children}
    </AlertBoxContext.Provider>);
}

export const useAlertBoxContext = () => {
    return useContext(AlertBoxContext);
}