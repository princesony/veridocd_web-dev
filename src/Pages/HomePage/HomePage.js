import React from 'react';
import './HomePage.css';
import { OtpProvider, useOtpContext} from '../../Providers/OtpProvider';
import SignInPopUp from '../../Elements/SignInPopUps/SignInPopUp';
import OtpPopUp from '../../Elements/SignInPopUps/OtpPopUp';

const HomePage = () => {
    
    return (
        <OtpProvider>
            <PopUps/>
        </OtpProvider>
      
    );

}

const PopUps = () => {
    const { popUp } = useOtpContext();

    return(
        popUp === "1" ? <SignInPopUp/> : <OtpPopUp/>
    );
}


export default HomePage;