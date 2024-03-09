import { useState, createContext, useContext  } from "react";
import { setUpRecaptcha } from "./AuthProvider";

const OtpContext = createContext();

export const OtpProvider = ({children}) => {

    const [phoneNo, setPhoneNo] = useState();
    const [id, setId] = useState("");
    const [confirmObj, setConfirmObj] = useState();
    const [otp, setOtp] = useState();
    const [loading, setLoading] = useState(false);
    const [popUp, setPopUp] = useState("1");
    const [errorMsg, setErrorMsg] = useState("");

    const getOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        await setUpRecaptcha('recaptcha-container', phoneNo).then(
            (confirmationResult) => {
                setConfirmObj(confirmationResult);
                setErrorMsg("");
                setLoading(false);
                setPopUp("2");
            }
            
        ).catch((error) => {
            setErrorMsg(error);
            setLoading(false);
        });
        
    }

    const verifyOtp = async (onSuccess) => {
        setLoading(true);
        try {
            await confirmObj.confirm(otp);
            setErrorMsg("");
            setLoading(false);
            onSuccess();
            
        } catch (err) {
            setErrorMsg(err.code);
            setLoading(false);
            console.log(err);
        }
        
    }

    return (
        <OtpContext.Provider value={{getOtp, verifyOtp, loading, errorMsg, phoneNo, setPhoneNo,
         otp, setOtp, popUp, setPopUp, id, setId}}>
          {children}
        </OtpContext.Provider>
    );
}

export const useOtpContext = () => {
    return useContext(OtpContext);
}