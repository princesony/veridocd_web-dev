import React, { useState } from 'react';
import PopUpBox from '../PopUpBox/PopUpBox';
import { Paper } from '@mui/material';
import { CustomTextField } from '../CustomTextField/CustomTextField';
import SolidButton from '../SolidButton/SolidButton';
import { useOtpContext } from '../../Providers/OtpProvider';
import AlertBox from '../AlertBox/AlertBox';

const SignInPopUp = () => {
  const { phoneNo, id, setPhoneNo, errorMsg, loading, setId, getOtp } = useOtpContext();
  const [helperPhone, setHelperPhone] = useState("");
  const isValidPhoneNumber = (number) => {
    var str = "Enter a valid phone number";
    var nullStr = "";
    if ((number.length !== 10) || isNaN(number)) {
      setHelperPhone(str);
    } else {
      setHelperPhone(nullStr);
    }
  }
  const handlePhone = (value) => {
    isValidPhoneNumber(value.target.value);
    setPhoneNo(value.target.value);
  }
  return (
    <PopUpBox >
      <Paper variant="outlined"
        sx={{ width: "98%", height: "480px" }}>
        <div style={{
          width: '100%',
          textAlign: 'center',
          marginTop: "30px"
        }
        }>
          {errorMsg.length === 0 ? null : <AlertBox severity="error" text={errorMsg} />}

          <div
            style={{
              textAlign: 'center',
              margin: "10px",
              fontFamily: "Roboto,Helvetica,Arial,sans-serif",
            }}
          >
            <Paper elevation={0} />
            Enter Mobile Number
            <Paper />
          </div>

          <CustomTextField value={phoneNo}
            onChange={handlePhone}
            helperText={helperPhone}
            label="Phone No"
            variant="outlined" />

          {/* <CustomTextField value = { id }
          onChange = { (e) => setId(e.target.value) }
          key = "agency-id"
          label = "Agency ID"
          type = "password"
          variant = "outlined" /> */}

          <div style={{ alignItems: "center", margin: '30px', display: 'inline-flex' }}>
            <div id="recaptcha-container" ></div>
          </div>


          <SolidButton
            disabled={loading}
            display="block"
            label="Get Otp"
            size="large"
            onHover="#398139"
            onPress={getOtp} />
        </div>
      </Paper>
    </PopUpBox>);
}

export default SignInPopUp;