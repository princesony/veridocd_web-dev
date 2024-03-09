import { Grid } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom"
import { ClipLoader } from "react-spinners";
import { FileWrapper } from "../../Elements/FileWrapper/FileWrapper";
import { database} from "../../Firebase/Firebase";
import { useAuthContext } from "../../Providers/AuthProvider";
import { getUrl } from "../../Utils/StorageMethods";

const FieldVerifierDetailsPage = () => {
    const {id} = useParams();
    const {user} = useAuthContext();
    const [fv, setFv] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [aadhar, setAadhar] = useState('');
    const [pan, setPan] = useState('');
    const {state} = useLocation();
    const {mode} = state;

    const getFVDetails = async () => {
        setIsLoading(true);
        if (mode === 'add') {
          await getDoc(doc(database, 'agency/' + user.uid, 'add_requests/' + id)).then(async snapshot => {
            setFv({...snapshot.data()});
            await getUrl(snapshot.data().panRef).then((url) => {
              setPan(url);
            });
            await getUrl(snapshot.data().aadharRef).then((url) => {
              setAadhar(url);
            });
            setIsLoading(false);
          });} else {
            await getDoc(doc(database, "field_verifier", id)).then(async (snapshot) => {
              setFv({...snapshot.data()});
              await getUrl(snapshot.data().panRef).then((url) => {
                setPan(url);
              });
              await getUrl(snapshot.data().aadharRef).then((url) => {
                setAadhar(url);
              });
              setIsLoading(false);
          });}
        
    }

    useEffect(() => {
        getFVDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (!isLoading ? <div>
        <Grid container sx={{
        marginBottom: '1em',
        borderRadius: '3px',
        border: '1px solid grey',
        borderBottomColor: 'transparent',
        width: '100%',
      }}>
        <Grid item lg={6} style={{display: 'flex', borderBottom: '1px solid grey',
          width: '100%'
        }}>
          <div style={{color: 'grey', height: '100%', backgroundColor: 'whitesmoke',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '14px',
            minWidth: '25%'}}>
            Name
          </div>
          <div style={{width: '100%', justifyContent: 'center',
          overflow: 'hidden',
           textOverflow: 'ellipsis',
           fontFamily: 'Source Serif Pro, serif',
           display: 'flex', margin: '0.5em'}}>
            {fv.name}
          </div>
        </Grid>

        <Grid item lg={6} style={{display: 'flex', width: '100%', borderBottom: '1px solid grey', }}>
        <div style={{color: 'grey', height: '100%', backgroundColor: 'whitesmoke',
            alignItems: 'center',
            fontWeight: 'bold',
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'center',
            minWidth: '25%'}}>
            ID
          </div>
          <div style={{justifyContent: 'center', display: 'flex',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontFamily: 'Source Serif Pro, serif',
            margin: '0.5em', width: '100%'}}>
            {fv.id}
          </div>
        </Grid>
        <Grid item lg={6} style={{display: 'flex', borderBottom: '1px solid grey',
          width: '100%'
        }}>
          <div style={{color: 'grey', height: '100%', backgroundColor: 'whitesmoke',
            alignItems: 'center',
            display: 'flex',
            fontWeight: 'bold',
            fontSize: '14px',
            justifyContent: 'center',
            minWidth: '25%'}}>
            Email Address
          </div>
          <div style={{
            fontFamily: 'Source Serif Pro, serif',
            width: '100%', justifyContent: 'center', display: 'flex', margin: '0.5em'}}>
            {fv.email}
          </div>
        </Grid>
        <Grid item lg={6} md={12} style={{display: 'flex', borderBottom: '1px solid grey',
          width: '100%'
        }}>
          <div style={{color: 'grey', backgroundColor: 'whitesmoke',
            alignItems: 'center',
            display: 'flex',
            fontWeight: 'bold',
            fontSize: '14px',
            justifyContent: 'center',
            minWidth: '25%'}}>
            Phone
          </div>
          <div style={{
            fontFamily: 'Source Serif Pro, serif',
            display: 'flex', justifyContent: 'center', margin: '0.5em', width: '100%'}}>
            {fv.phone}
          </div>
        </Grid>
        
      </Grid>
      <Grid container sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Grid item xs={12} md={6}>
          <div style={{
            padding: '1em 2em',
            margin: '0 auto'
          }}>
            {pan !== '' ?
              <FileWrapper url={pan} name="Pan Card">
                <iframe src={pan} title='g' style={{}}>
                </iframe>
              </FileWrapper> :
              <div>
                No Pan Card Added by Field Verifier
              </div>}
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div style={{
            margin: '0 auto',
            padding: '1em 2em',
          }}>
            {aadhar !== '' ?
              <FileWrapper url={aadhar} name="Aadhar Card"/> :
              <div>
                No Aadhar Card Added by Field Verifier
              </div>}
          </div>
        </Grid>
      </Grid>
    </div> : <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100vh',
    }}><ClipLoader loading={true} size={30}/></div> );
}

export default FieldVerifierDetailsPage;