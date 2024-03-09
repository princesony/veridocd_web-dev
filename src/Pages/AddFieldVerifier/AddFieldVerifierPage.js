import { Divider, Grid, Typography } from '@mui/material';
import AddRequestItem from '../../Elements/AddRequestItem/AddRequestItem';
import { useAddRequestContext } from '../../Providers/AddRequestProvider';

const AddFieldVerifierPage = () => {
    const {addReq} = useAddRequestContext();
    return (
        <div>
        <div style={{display: 'inline-flex', padding: "0 0.5em 0.5em 0"}}>
            <Typography sx={{padding: '0 0.4em', fontSize: '19px', fontFamily: 'Playfair Display, serif'}}>
            Add Requests</Typography></div>
            <Divider style={{marginBottom: '1em'}}/>
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
            {addReq.map((element, index) => (<AddRequestItem  {...element} key={index}/>))}
        </div>
    );
}

export default AddFieldVerifierPage;