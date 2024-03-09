/* eslint-disable react-hooks/exhaustive-deps */
import { PersonRounded } from "@mui/icons-material";
import { Grid, Paper, Typography } from "@mui/material";
import React, { forwardRef, useImperativeHandle } from "react";
import { personValidation } from "../../Models/PersonDetails";
import { useForm } from "../../Utils/FormValidator";
import { StyledTextField } from "../../Elements/CustomTextField/CustomTextField";

const PersonDetailsForm = forwardRef((props, ref) => {
  const [data, setData, validate, errors] = useForm(personValidation);
  useImperativeHandle(ref, () => ({
    isValid: () => {
      return validate();
    },
    getData: () => data,
  }));
  return (
    <Grid item xs={12} p="0.5em" md={6}>
      <Paper
        variant="outlined"
        sx={{
          p: "1em 2em 2em 2em",
          minWidth: "300px",
          margin: "0 auto"
        }}
      >
        <Typography
          fontFamily="Playfair Display, serif"
          fontSize="23px"
          sx={{ display: "flex", alignItems: "end" }}
          fontWeight={"regular"}
        >
          <PersonRounded
            sx={{
              color: "#4dc3c8",
              mb: "0.27em",
              mr: "0.6em",
              transform: "scale(1.3)",
            }}
          />
          {props.person} Details
        </Typography>

        <Grid container>
          <Grid item xs={6} pr="1em">
            <StyledTextField
              label="First Name"
              error={errors?.fName}
              value={data.fName}
              onChange={(event) => {
                setData((prev) => ({ ...prev, fName: event.target.value }));
              }}
            />
          </Grid>
          <Grid item xs={6} pl="1em">
            <StyledTextField
              label="Last Name"
              error={errors.lName}
              value={data.lName}
              onChange={(event) => {
                setData((prev) => ({ ...prev, lName: event.target.value }));
              }}
            />
          </Grid>
          {/* <Grid item xs={12}>
            <StyledTextField
              error={errors?.address1}
              label="Address Line 1"
              value={ data.address1}
              onChange={(event) => {
                setData((prev) => ({ ...prev, address1: event.target.value }));
              }}
            />
          </Grid> */}
          {/* <Grid item xs={12}>
            <StyledTextField
              label="Address Line 2"
              onChange={(event) => {
                setData((prev) => ({ ...prev, address2: event.target.value }));
              }}
            />
          </Grid> */}
          <Grid item xs={6} pr="1em">
            <StyledTextField
              error={errors?.phone}
              label="Phone Number"
              value={ data.phone}
              onChange={(event) => {
                setData((prev) => ({ ...prev, phone: event.target.value }));
              }}
            />
          </Grid>
          {/* <Grid item xs={6} pl="1em">
            <StyledTextField
              error={errors?.pincode}
              label="Pin Code"
              value={ data.pincode}
              onChange={(event) => {
                setData((prev) => ({ ...prev, pincode: event.target.value }));
              }}
            />
          </Grid> */}
          {/* <Grid item xs={6} pr="1em">
            <StyledTextField
              error={errors?.city}
              value={ data.city}
              label="City"
              onChange={(event) => {
                setData((prev) => ({ ...prev, city: event.target.value }));
              }}
            />
          </Grid> */}
          {/* <Grid item xs={6} pl="1em">
            <StyledTextField
              error={errors?.state}
              value={ data.state}
              label="State"
              onChange={(event) => {
                setData((prev) => ({ ...prev, state: event.target.value }));
              }}
            />
          </Grid> */}
        </Grid>
      </Paper>
    </Grid>
  );
});

export default PersonDetailsForm;
