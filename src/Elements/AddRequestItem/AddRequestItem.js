import { Avatar, Button, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Done, Clear, InfoOutlined} from '@mui/icons-material';
import './AddRequestItem.css';
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { database } from '../../Firebase/Firebase';
import { useAuthContext } from '../../Providers/AuthProvider';
import { useFieldVerifiersContext } from '../../Providers/FieldVerifiersProvider';
import { useNavigate } from 'react-router-dom';
import { useToastProvider } from '../../Providers/ToastProvider';
import { getUrl } from '../../Utils/StorageMethods';


const AddRequestItem = (props) => {
    const {user} = useAuthContext();
    const {fvs} = useFieldVerifiersContext();
    const navigate = useNavigate();
    const {showSuccess, showError} = useToastProvider();
    const [pfp, setPfp] = useState();
    const getPfp = async () => {
      let url = props.profile_picture;
      if (url !== null && url !== undefined && url !== '') {
        await getUrl(url).then(pfpUrl => {
          setPfp(pfpUrl);
        });
      }
    }
    useEffect(() => {
      getPfp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addFv = async (uid, data) => {
        await deleteDoc(doc(database, `agency/${user.uid}/add_requests`, uid)).then(async () => {
          await updateDoc(doc(database, "agency", user.uid), {
            field_verifiers: [...fvs, uid]
          }).then(async () => {
            let date = new Date();
            await getDoc(doc(database, "field_verifier", uid)).then(async (snap) => {
              await setDoc(doc(database, "field_verifier", uid), {...data,
                joiningDate: `${date.getDay()}/${date.getMonth()+1}/${date.getFullYear()}`
              }).then(async () => {
                await updateDoc(doc(database, "add_requests", uid), {
                  status: 'accepted'
                }).then(() => {
                  showSuccess("Successfully added Field Verifier");
                });
              });
            })
          });
        }).catch(err => {
          showError(err);
        });
    }

    const deleteReq = async (uid) => {
      await deleteDoc(doc(database, `agency/${user.uid}/add_requests`, uid)).then(async () => {
        await updateDoc(doc(database, "add_requests", uid), {
          status: 'rejected'
        });
      });
    }

    return (
        <div key={props.index} style={{
          width: '100%',
          minWidth: '900px'
        }}>
          <Grid container style={{
              margin: '0.6em 0em',
              fontSize: '14px',
              color: 'gray',
              fontFamily: 'Source Serif Pro, serif'
          }}>
              <Grid item sx={{display: 'flex', justifyContent: 'end', alignItems: 'center'}} xs={1}>
                {pfp === null || pfp === undefined || pfp === '' ? <Avatar>
                  {String(props.name).substring(0, 1).toUpperCase()}
                </Avatar> : <Avatar src={pfp}/>}
              </Grid>
              <Grid item sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} xs={2}>
                {props.id}
              </Grid>
              <Grid item sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} xs={3} >
                {props.name ?? ''}
              </Grid>
              <Grid item sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} xs={3} >
                {props.phone ?? 8768715527}
              </Grid>
              <Grid item sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} xs={3}>
              <Button size="small" sx={{
                fontSize: '10px',
                color: 'gray',
                border: '1.3px solid #e0e0e0',
                borderTopRightRadius: '0px',
                borderBottomRightRadius: '0px',
                borderTopLeftRadius: '17px',
                borderBottomLeftRadius: '17px',
                padding: '0.5em 1.3em 0.5em 0.3em',
                fontWeight: 'bold',
                '&:hover': {
                  border: '1.3px solid red',
                  bgcolor: 'black',
                  color: 'white'
                }
              }} onClick={() => {
                navigate('/dashboard/fieldVerifier/' + props.uid, {state: {mode: 'add'}});
              }}>
                <InfoOutlined fontSize='small' sx={{
                  transform: 'scale(0.8)'
                }}/>
                View
              </Button>
              <Button size='small' sx={{
                fontSize: '10px',
                color: 'red',
                border: '1.3px solid #e0e0e0',
                borderTopRightRadius: '0px',
                borderBottomRightRadius: '0px',
                borderTopLeftRadius: '0px',
                borderBottomLeftRadius: '0px',
                padding: '0.5em 1.3em 0.5em 0.3em',
                fontWeight: 'bold',
                '&:hover': {
                  border: '1.3px solid red',
                  bgcolor: 'red',
                  color: 'white'
                },
              }} onClick={async () => {
                await deleteReq(props.uid);
              }}>
                <Clear fontSize='small' sx={{
                  transform: 'scale(0.8)'
                }}/>
                Reject
              </Button>
              <Button sx={{
                fontSize: '10px',
                color: 'green',
                border: '1.3px solid #e0e0e0',
                borderTopRightRadius: '17px',
                borderBottomRightRadius: '17px',
                borderTopLeftRadius: '0px',
                borderBottomLeftRadius: '0px',
                padding: '0.5em 1.3em 0.5em 0.3em',
                fontWeight: 'bold',
                '&:hover': {
                  border: '1.3px solid green',
                  bgcolor: 'green',
                  color: 'white'
                },
              }} size='small' onClick={() => {
                addFv(props.uid, props);
              }}>
                <Done fontSize='small' sx={{
                  transform: 'scale(0.8)'
                }}/>
                Accept
              </Button>
              <div style={{margin: '0.3em'}}></div>
              </Grid>
        </Grid>
        <hr style={{width: '93%', margin: '0 auto 0.15em auto', border: '0.6px solid #dedede'}}/>
        </div>
    );
}

export default AddRequestItem;