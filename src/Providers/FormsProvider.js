import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { database } from "../Firebase/Firebase";
import { useAuthContext } from "./AuthProvider";

const FormsContext = createContext();

export const FormsProvider = ({children}) => {
    const {user} = useAuthContext();
    const [forms, setForms] = useState([]);
    const addForm = async (data) => {
        await addDoc(collection(database, `agency/${user.uid}/forms/`), data);
    }
    useEffect(() => {
        var unsubscribe = () => {};
        if (user !== null && user !== undefined) {
            unsubscribe = onSnapshot(collection(database, `agency/${user.uid}/forms`), 
            (snapshot) => {
                let data = [];
                snapshot.docs.forEach((doc) => {
                    data.push({...doc.data(), id: doc.id});
            });
                setForms(data);
            });
        }
        return () => {
            unsubscribe();
        }
    }, [user]);
    return (
    <FormsContext.Provider value={{forms, addForm}}>
        {children}
    </FormsContext.Provider>)
}

export const useFormsContext = () => {
    return useContext(FormsContext);
}