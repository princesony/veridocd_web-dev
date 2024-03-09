import { Grid, Paper } from '@mui/material';
import React from 'react';

const GridItem = ({children}) => {
    return (
      <div>
        <Paper elevation={4} sx={{
          margin: '0.3% auto',
          textAlign: 'center',
          height: '330px',
          width: '95%',
          maxWidth: '580px',
          minWidth: '200px',
          // border: '1px solid #826c6c69'
        }}>{children}</Paper>
      </div>
    );
  }
  

const SummaryPage = () => {
    return (
    <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <GridItem>Assignments</GridItem>
        </Grid>
        <Grid item xs={12} md={6}>
          <GridItem>Verifications</GridItem></Grid>
        <Grid item xs={12} md={6}>
          <GridItem>
            Document Status
          </GridItem></Grid>
        <Grid item xs={12} md={6}>
          <GridItem>
            Field Verifiers
            </GridItem>
            </Grid>
      </Grid>);
}

export default SummaryPage;