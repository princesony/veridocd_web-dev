import React, {createContext, useContext, useEffect, useState} from 'react'
import {authentication} from '../Firebase/Firebase';
import { onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useToastProvider } from './ToastProvider';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const {showSuccess, showError} = useToastProvider();
    const [user, setUser] = useState({});

    const logOut = async () => {
        await authentication.signOut().then(() => {
            showSuccess("Logged out Successfully");
        }).catch(err => {
            showError('There was some problem logging out');
        });
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authentication, async (currentUser) => {
            setUser(currentUser);
            window.user = currentUser;
        })
        if (user !== null && Object.keys(user).length !== 0) {
            console.log(user);
            showSuccess("You are successfully logged in");
        }
        return () => {
            unsubscribe();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <AuthContext.Provider value={{user, logOut}}>
            {children}
        </AuthContext.Provider>
    );
}

export const setUpRecaptcha = async (element, phone) => {
    window.recaptchaVerifier = new RecaptchaVerifier(element, {}, authentication);
    window.recaptchaVerifier.render();
    return await signInWithPhoneNumber(authentication, '+91' + phone, window.recaptchaVerifier);
}

export const useAuthContext = () => {
    return useContext(AuthContext);
}