import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { database } from "../Firebase/Firebase";
import { useAuthContext } from "./AuthProvider";

const FieldVerifiersContext = createContext();

export const FieldVerifiersProvider = ({children}) => {

    const [fvs, setFvs] = useState([]);

    const {user } = useAuthContext();

    useEffect(() => {
        let unsubscribe = () => {};
        if (user !== null && user !== undefined) {
            if (user.uid !== null && user.uid !== undefined) {
                unsubscribe = onSnapshot(doc(database, "agency", user.uid),
                (snapshot) => {
                  let data = [];
                  snapshot.data().field_verifiers?.forEach((fv) => {
                      data.push(fv);
                  });
                  setFvs(data);
                });
                return () => {
                  unsubscribe();
                };
            }
        }
    }, [user]);

    return (
        <FieldVerifiersContext.Provider value={{fvs}}>
            {children}
        </FieldVerifiersContext.Provider>
    );
}

export const useFieldVerifiersContext = () => {
    return useContext(FieldVerifiersContext);
}