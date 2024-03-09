import React from 'react';
import SolidButton from '../SolidButton/SolidButton';
import { Paper, Typography } from '@mui/material';
import PopUpBox from '../PopUpBox/PopUpBox';
import OtpInput from 'react-otp-input-rc-17';
import { useOtpContext } from '../../Providers/OtpProvider';
import { useNavigate } from 'react-router-dom';
import AlertBox from '../AlertBox/AlertBox';


const OtpPopUp = () => {

    const navigate = useNavigate();
    const {otp, phoneNo, setPopUp, errorMsg, setOtp, verifyOtp } = useOtpContext();

    return (<PopUpBox >
        <Paper variant = "outlined"
        sx = {{ width: "98%", height: "480px" }}>
        <div style = {
            {
                width: '100%',
                textAlign: 'center',
            }
        }>
            <div style = {
                { margin: '60px'}
            } >
              <Typography variant='h5'> Enter the OTP sent to</Typography>
              <Typography variant='h5'>{'+91 ' + phoneNo} </Typography>
            </div>

            {errorMsg.length === 0 ? null : <AlertBox severity="error" text={errorMsg}/>}

            <div style={{textAlign: 'center', paddingLeft: '8.3em', paddingTop: '2em', paddingBottom: '4em'}}>
              <OtpInput className="OtpInput"
                key="otp-input"
                value={otp}
                onChange={ value => setOtp(value)}
                numInputs={6}/>
            </div>
          <SolidButton label = "Go Back"
              size = "large"
              display = "inline"
              variant = "outlined"
              background = "white"
              color = "green"
              onPress = { () => {
                setPopUp("1");
              }} />
            
            <SolidButton 
              display = "inline" 
              label = "Verify OTP" 
              size = "large"
              onHover = "#398139"
              onPress = { () => {
                  verifyOtp(() => {
                      navigate('/dashboard');
                  });
              } }
              />
        </div>
        </Paper>
      </PopUpBox>);
}

export default OtpPopUp;