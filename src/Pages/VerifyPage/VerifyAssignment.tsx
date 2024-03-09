import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, SxProps, TextField, Typography } from "@mui/material";
import { doc, DocumentData, getDoc, updateDoc } from "firebase/firestore";
import React, { ChangeEventHandler, FC, useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { database } from "../../Firebase/Firebase";
import { useToastProvider } from "../../Providers/ToastProvider";
import { AssignmentData, FvDetails } from "../../Utils/types";
import {useAuthContext} from "./../../Providers/AuthProvider";
import ResultPage from "../AssignmentsPage/ResultPage";
import './VerifyAssignment.css';

const VerifyAssignment : FC = () : JSX.Element => {
    const {id} = useParams();
    const {state} = useLocation();
    const navigate = useNavigate();
    const data: AssignmentData = state as AssignmentData; 
    console.log(state)
    const detailItemsStyle: SxProps = {
        display: 'inline-flex',
        width: '90%',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '0.7em 2em',
    }
    const [remarks, setRemarks] = useState<string>("");
    const [fvDetails, setFvDetails] = useState<FvDetails>();
    const [open, setOpen] = useState<boolean>(false);
    const [dialogType, setDialogType] = useState<number>();
    const {user} = useAuthContext();
    const getFvDetails = async () => {
        await getDoc(doc(database, 'field_verifier', data.fv)).then(snapshot => {
            let data : FvDetails | undefined = snapshot.data() as FvDetails;
            setFvDetails(data);
        });
    }
    const {showSuccess, showError} = useToastProvider();
    useEffect(() => {
        getFvDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleDialogClose = () => {
        setOpen(false);
    }
    const handleApprove = () => {
        setDialogType(1);
        setOpen(true);
    }
    const handleReassign = () => {
        setDialogType(0);
        setOpen(true);
    }
    const handleClick = async () => {
        handleDialogClose();
        await updateDoc(doc(database, 'agency/' + user.uid + '/assignments', data.id), {
            "status": dialogType === 0 ? "reassigned" : "approved"
        }).then(async () => {
            await getDoc(doc(database, 'assignments', data.id)).then(async snapshot => {
                let history = snapshot.data()?.history as Array<DocumentData>;
                let date = new Date();
                history.push({
                    status: dialogType === 0 ? "reassigned" : "approved",
                    date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                });
                await updateDoc(doc(database, 'assignments', data.id), {
                    history: history,
                    remarks: dialogType === 0 ? remarks : "",
                    status: dialogType === 0 ? "reassigned" : "approved"
                }).then(async () => {
                    await updateDoc(doc(database, 'field_verifier/' + data.fv
                    + '/assignments', data.id), {
                        status: dialogType === 0 ? "reassigned" : "approved"
                    }).then(() => {
                        navigate('/dashboard/assignment/verify');
                        showSuccess(dialogType === 0 ?
                            "Assignment Reassigned" : "Assignment Approved");
                    });
                });
            });
        }).catch(err => {
            showError();
        });
    }
    const handleChange : ChangeEventHandler<HTMLInputElement> = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRemarks(event.target.value);
    }
    return (<div>
        <Dialog open={open} onClose={handleDialogClose}>
            <DialogTitle>
                {dialogType === 0 ? "Are you sure to Re-assign?" : "Are you sure to Approve the Response?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText paddingBottom={2}>{dialogType === 0 ? "Mention the reasons of reassignment" : 
                "This will change the status of assignment to be approved"}</DialogContentText>
                {dialogType === 0 ? <TextField value={remarks}
                onChange={handleChange} variant="filled" label='Remarks' multiline={true}/> : null}
            </DialogContent>
            <DialogActions>
                <Button color="error" variant="contained" onClick={handleDialogClose}>Cancel</Button>
                <Button color="success" variant="contained" onClick={handleClick} autoFocus>{dialogType === 0 ?
                "Reassign" : "Approve"}</Button>
            </DialogActions>
        </Dialog>
        <Grid container direction="row"><Grid container md={5}>
        <Paper variant="outlined" sx={{
            padding: '1em 0.2em'
        }}>
            <Grid>
                <Grid sx={detailItemsStyle} item md={12}>
                    <div className="keys">
                        Assignment ID
                    </div>
                    {data.id}
                    <Button size='small' variant="outlined" onClick={() => {
                        navigate('/dashboard/assignment/'+data.id);
                    }}>
                        View Assignment
                    </Button>
                </Grid>
                <Grid sx={detailItemsStyle} item md={12}>
                    <div className="keys">
                        Field Verifier ID
                    </div>
                    {fvDetails?.id}
                    <Button size="small" variant="outlined" onClick={() => {
                        navigate('/dashboard/fieldVerifier/'+data.fv,
                        {state: {mode: ''}});
                    }}>
                        View Field Verifier
                    </Button>
                </Grid>
                <Grid sx={detailItemsStyle} item md={12}>
                    <div className="keys">
                        Document Type
                    </div>
                    {data.docType}
                </Grid>
                <Grid sx={{...detailItemsStyle, justifyContent: 'center'}} item md={12}>
                    <Button color="error" variant='contained' onClick={handleReassign}>Reassign</Button>
                    <div style={{width: '10px'}}/>
                    <Button color="success" variant="contained" onClick={handleApprove}>Approve</Button>
                </Grid>
                <Grid sx={{...detailItemsStyle, justifyContent: 'center'}} item md={12}>
                    <div className="keys" style={{width: '10px'}}/>
                </Grid>
            </Grid>
        </Paper></Grid>
        <Grid container md={7}>
            <Typography variant="h5" fontWeight="bold" sx={{margin: '0em auto 0.6em auto'}}>
                Result
            </Typography>
            <ResultPage id={id}/>
        </Grid>
        </Grid>
    </div>)
}

export default VerifyAssignment;