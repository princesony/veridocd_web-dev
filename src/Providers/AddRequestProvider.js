import { collection, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { database } from "../Firebase/Firebase";
import { useAuthContext } from "./AuthProvider";


const AddRequestContext = createContext();

export const AddRequestProvider = ({children}) => {
    const [addReq, setAddReq] = useState([]);

    const {user} = useAuthContext();

    useEffect(() => {
        let unsubscribe = () => {};
        if (user !== null && user !== undefined) {
            unsubscribe = onSnapshot(collection(database, `agency/${user.uid}/add_requests`), 
            (snapshot) => {
                let data = [];
                snapshot.docs.forEach((element) => {
                    data.push({...element.data(), uid: element.id});
                });
                setAddReq(data);
            });
        }
        return () => {
            unsubscribe();
        }
    }, [user]);

    return (<AddRequestContext.Provider value={{addReq}}>
      {children}
    </AddRequestContext.Provider>);
}

export const useAddRequestContext = () => {
    return useContext(AddRequestContext);
}