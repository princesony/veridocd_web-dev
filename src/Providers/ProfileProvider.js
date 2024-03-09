import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react"
import { database } from "../Firebase/Firebase";
import { useAuthContext } from "./AuthProvider";

const ProfileContext = createContext();

export const ProfileProvider = ({children}) => {
    const {user} = useAuthContext();
    const [profile, setProfile] = useState({});
    useEffect(() => {
        if (user === null || user.uid === undefined) return;
        const unsubscribe = onSnapshot(doc(database, 'agency', user.uid), snapshot => {
            setProfile(snapshot.data());
        });
        return unsubscribe;
    }, [user]);
    return (<ProfileContext.Provider value={{profile}}>
        {children}
    </ProfileContext.Provider>)
}

export const useProfileContext = () => useContext(ProfileContext);