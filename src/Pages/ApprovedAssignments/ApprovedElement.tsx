import { Accordion, AccordionSummary, AccordionDetails, Button, Grid, TextField, Dialog, DialogContent, DialogTitle, DialogActions } from "@mui/material";
import { ExpandMore, DateRangeRounded } from '@mui/icons-material';
import React, { FC, useEffect, useState } from "react";
import { doc, DocumentData, getDoc, updateDoc } from "firebase/firestore";
import { database } from "../../Firebase/Firebase";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../Providers/AuthProvider";
import { useToastProvider } from "../../Providers/ToastProvider";

interface ApprovedElementProps {
  id: string,
  form_name: string,
  assigned_to: string,
  assigned_name: string,
}

const ApprovedElement: FC<ApprovedElementProps> = (props): JSX.Element => {
  const navigate = useNavigate();
  const [details, setDetails] = useState<any>();
  const getDetails = async () => {
    await getDoc(doc(database, 'assignments', props.id))
      .then(snapshot => {
        setDetails(snapshot.data());
      });
  }
  const { user } = useAuthContext();
  const [open, setOpen] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<number>();
  const [remarks, setRemarks] = useState<string>('');
  const { showSuccess, showError } = useToastProvider();

  const handleClose = () => {
    setOpen(false);
  }

  const convert = (timestamp) => {
    if (!timestamp) {
      return '';
    }


    if (typeof timestamp == "string") {
      return timestamp;
    }

    if (typeof timestamp == "object") {
      return timestamp.toDate().toDateString() + "  " + timestamp.toDate().toLocaleTimeString('en-US')
    }

  }

  useEffect(() => {
    getDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleClick = async () => {
    setOpen(false);
    await updateDoc(doc(database, 'agency/' + user.uid + '/assignments', props.id), {
      "status": dialogType === 0 ? "reassigned" : "archived"
    }).then(async () => {
      await getDoc(doc(database, 'assignments', props.id)).then(async snapshot => {
        let history = snapshot.data()?.history as Array<DocumentData>;
        let date = new Date();
        history.push({
          status: dialogType === 0 ? "reassigned" : "archived",
          date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        });
        await updateDoc(doc(database, 'assignments', props.id), {
          history: history,
          remarks: dialogType === 0 ? remarks : "",
          status: dialogType === 0 ? "reassigned" : "archived"
        }).then(async () => {
          await updateDoc(doc(database, 'field_verifier/' + props.assigned_to
            + '/assignments', props.id), {
            status: dialogType === 0 ? "reassigned" : "archived"
          }).then(() => {
            showSuccess(dialogType === 0 ?
              "Assignment Reassigned" : "Assignment Archived");
          });
        });
      });
    }).catch(err => {
      showError();
    });
  }
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {dialogType === 0 ? 'Are you sure to Re-assign?' : 'Are you sure to Archieve?'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 0 ? 'Give some instruction to Field Verifier about what went wrong'
            : 'This assignment will be archieved. You can still find it in Vault'}
          <div style={{ height: '20px' }} />
          {dialogType === 0 ? <TextField size="small" variant='filled' multiline
            onChange={(e) => {
              setRemarks(e.target.value);
            }} label='Remarks' sx={{ width: '300px' }} value={remarks} /> : null}
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>Cancel</Button>
          <Button color="success" onClick={handleClick}>
            {dialogType === 0 ? "Reassign" : "Archive"}</Button>
        </DialogActions>
      </Dialog>
      <Accordion expanded={expanded} elevation={0} onChange={(e, val) => {
        e.preventDefault();
        setExpanded(val);
      }}>
        <AccordionSummary expandIcon={<ExpandMore />} sx={{
          width: "100%",
          margin: '0.1em 0',
          fontSize: '14px',
          display: 'inline-flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <Grid container>
            <Grid item xs={12} sm={12} lg={4} md={4} sx={{
              display: 'flex', justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{ marginLeft: '1.7em', fontFamily: 'Source Serif Pro, serif' }}>
                {props.id}
              </div>
            </Grid>
            <Grid item xs={12} sm={12} lg={2} md={2} sx={{
              display: 'flex', justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{ marginLeft: '1.7em', fontFamily: 'Source Serif Pro, serif' }}>
                {props.form_name}
              </div>
            </Grid>

            <Grid item xs={12} sm={12} lg={4} md={4} sx={{
              display: 'flex', justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{ marginLeft: '1.7em', fontFamily: 'Source Serif Pro, serif' }}>
                {props.assigned_name}
                {/* <FvName uid={props.assigned_name} /> */}
              </div>
            </Grid>
            
            <Grid item xs={12} sm={12} lg={2} md={2} sx={{
              display: 'flex', justifyContent: 'center',
              alignItems: 'center'
            }}>
              {/* <Button size='small' variant='contained' onClick={() => {
                setDialogType(0);
                setOpen(true);
              }}>Reassign</Button> */}
              <div style={{ margin: '0 0.4em', display: 'inline' }} />
              <Button size='small' variant="contained" onClick={() => {
                setDialogType(1);
                setOpen(true);
              }}>
                Archive
              </Button>
              <Button size='small' variant='contained' onClick={async () => {
                navigate('/dashboard/assignment/print/' + props.id);
              }}>Print</Button>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container direction='row'>
            <Grid item sx={{
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center', fontSize: '14px',
            }} sm={3}>
              <div>
                <DateRangeRounded />
              </div>
              <div>
                {/* {details?.assigned_at} */}
                {convert(details?.assigned_at)}
              </div>
            </Grid>
            <Grid item sx={{
              display: 'flex',
              justifyContent: 'center', alignItems: 'center'
            }} sm={5}>
              <div style={{ margin: '0 1em', display: 'inline' }} />
            </Grid>
            <Grid item sx={{
              display: 'flex',
              justifyContent: 'center', alignItems: 'center'
            }} sm={4}>
              <Button size='small' variant="outlined" onClick={() => {
                navigate('/dashboard/assignment/' + props.id);
              }}>Assignment</Button>
              <div style={{ margin: '0 0.4em', display: 'inline' }} />
              <Button size='small' variant="outlined" onClick={() => {
                navigate('/dashboard/assignment/response',
                  {
                    state: {
                      id: props.id
                    }
                  });
              }}>Result</Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>);
}


interface FvProps {
  uid: string
}

const FvName: React.FunctionComponent<FvProps> = (props): JSX.Element => {
  const [name, setName] = useState<String>();
  const getFvName = async () => {
    const snapshot = await getDoc(doc(database, "field_verifier", props.uid));
    let data: DocumentData | undefined = snapshot.data();
    setName(data?.name);
  }
  useEffect(() => {
    getFvName();
  });
  return (<div>
    {name}
  </div>)
}

export default ApprovedElement;