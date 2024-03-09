import React from 'react';
import { useFieldVerifiersContext } from '../../Providers/FieldVerifiersProvider';
import FieldVerifierCard from '../../Elements/FieldVerifierCard/FieldVerifierCard';
import { useLocation } from 'react-router-dom';
import { Grid } from '@mui/material';
import './FieldVerifierPage.css';


const FieldVerifierPage = () => {
  const {fvs} = useFieldVerifiersContext();
  const {state} = useLocation();
  const {mode} = state;

  return (
      <div style={{
        width: "100%",
      }}>
        <Grid container style={{
              margin: '0.4em 0em',
              fontSize: '14px',
              color: '#404040',
              fontWeight: 'bold'
            }}>
              <Grid item xs={1} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                
              </Grid>
              <Grid item xs={2} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                Identifier
              </Grid>
              <Grid item xs={3} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                Name
              </Grid>
              <Grid item xs={3} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                Phone
              </Grid>
              <Grid item xs={3} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                Actions
              </Grid>
        </Grid>
        <hr style={{width: '93%', margin: '0 auto 0.15em auto', border: '0.6px solid #dedede'}}/>
        {fvs.map((element, index) => (
          <div key={index}>
            <FieldVerifierCard
              uid={element}
              select={mode === "select" ? 1 : 0}/>
          </div>
        ))}
      </div>
  );
}

export default FieldVerifierPage;