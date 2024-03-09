import { Button, Grid, Paper } from "@mui/material";
import { collection, doc, getDoc, onSnapshot, orderBy, query, where, deleteDoc, writeBatch } from "firebase/firestore";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { database } from "../../Firebase/Firebase";
import { useAuthContext } from "../../Providers/AuthProvider";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {
    documentTypes,
    useDraftAssignmentContext,
} from "../../Providers/DraftAssignmentProvider";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useToastProvider } from "../../Providers/ToastProvider";
import { useFormsContext } from "../../Providers/FormsProvider";
import { useFieldVerifiersContext } from "../../Providers/FieldVerifiersProvider";

let status1 = '';
let formName = '';

const AssignmentsPage = () => {
    const { showError, showSuccess } = useToastProvider();
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const { user } = useAuthContext();
    let unsubscribe = () => { };
    const [open, setOpen] = useState(false);
    const [assignmentId, setAssignmentId] = useState();
    const [assignmentIdDelete, setAssignmentDelete] = useState();
    const { forms } = useFormsContext();
    const { fvs } = useFieldVerifiersContext();

    const handleClickOpen = (assign) => {
        setAssignmentDelete(assign);
        setOpen(true);
    };

    const handleClose = (response) => {
        console.log(assignmentIdDelete);
        if (response == 'yes') {
            // deleteDoc(doc(database, "assignments", assignmentId));
            deleteAssignment();
        }
        setOpen(false);
    };

    const deleteAssignment = async (e) => {
        try {
            const batch = writeBatch(database);
            const ref1 = doc(database, "assignments", assignmentIdDelete.id);
            batch.delete(ref1);
            const ref2 = doc(database, `agency/${assignmentIdDelete.agency}/assignments`, assignmentIdDelete.id);
            batch.delete(ref2);
            const ref3 = doc(database, `field_verifier/${assignmentIdDelete.assigned_to}/assignments`, assignmentIdDelete.id);
            batch.delete(ref3);

            await batch.commit();

            showSuccess("Assignment deleted")
        } catch (e) {
            showError("failed to delete")
            // console.log("Transaction failed: ", e);
        }
    }

    const handleChange = async (e) => {
        status1 = e.target.value;
        unsubscribe();
        getAssignments();
    }

    const handleTypeChange = async (e) => {
        formName = String(e.target.value);
        unsubscribe();
        getAssignments();
    }

    const convert = (timestamp) => {
        if (typeof timestamp == "string") {
            return timestamp;
        } else {
            return timestamp.toDate().toDateString() + "  " + timestamp.toDate().toLocaleTimeString('en-US')
        }
    }

    const getAssignments = () => {
        let q;

        if (formName && status1) {
            q = query(collection(
                database
                , "assignments")
                , where("agency", "==", user.uid)
                , where("formName", "==", formName)
                , where("status", "==", status1)
                , orderBy("assigned_at", "desc")
            )
        } else if (formName) {
            q = query(collection(database
                , "assignments")
                , where("agency", "==", user.uid)
                , where("formName", "==", formName)
                , orderBy("assigned_at", "desc")
            )
        } else if (status1) {
            q = query(collection(database
                , "assignments")
                , where("agency", "==", user.uid)
                , where("status", "==", status1)
                , orderBy("assigned_at", "desc")
            )
        } else {
            q = query(collection(database,
                "assignments")
                , where("agency", "==", user.uid)
                // , where('history', 'array-contains', { date: "26/7/2023", status: 'approved' })
                , orderBy("assigned_at", "desc")
            )
        }


        if (user && user.uid !== undefined) {
            setAssignments([]);
            unsubscribe = onSnapshot(q, snapshot => {
                let data = [];
                snapshot.docs.forEach((doc) => {
                    data.push({ ...doc.data(), id: doc.id });
                });
                setAssignments(data);
            });
        }
    }



    useEffect(() => {
        getAssignments()
    }, [user]);

    return (<div>

        <Paper elevation={0}>
            <div style={{ display: 'flex', justifyContent: "end", padding: "0 10px 20px 10px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    Filter By :
                </div>

                <div>
                    <FormControl sx={{ ml: 1, minWidth: 160 }} size="small">
                        <InputLabel id="demo-simple-select-label">Select form</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="select tatus"
                            onChange={handleTypeChange}
                        >
                            <MenuItem value={''}>All</MenuItem>
                            {forms.map((form, index) => (
                                <MenuItem value={form.name}>{form.name}</MenuItem>))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ ml: 1, minWidth: 160 }} size="small">
                        <InputLabel id="demo-simple-select-label">Select status</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="select tatus"
                            onChange={handleChange}
                        >
                            <MenuItem value={''}>All</MenuItem>
                            <MenuItem value={'assigned'}>Assigned</MenuItem>
                            <MenuItem value={'in_progress'}>In Progress</MenuItem>
                            <MenuItem value={'submitted'}>Submitted</MenuItem>
                            <MenuItem value={'approved'}>Approved</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
        </Paper>


        <TableContainer component={Paper} elevation={3} variant="outlined">
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center" style={{ fontWeight: "800" }}>ID</TableCell>
                        <TableCell align="center" style={{ fontWeight: "800" }}>Form Name</TableCell>
                        <TableCell align="center" style={{ fontWeight: "800" }}>Name</TableCell>
                        <TableCell align="center" style={{ fontWeight: "800" }}>Status</TableCell>
                        <TableCell align="center" style={{ fontWeight: "800" }}>Assigned at</TableCell>
                        <TableCell align="center" style={{ fontWeight: "800" }}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {assignments.map((assignment) => {
                        return (
                            <TableRow
                                key={assignment.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center" component="th" scope="row">
                                    {assignment.id}
                                </TableCell>
                                <TableCell align="center"> {assignment.formName}</TableCell>
                                <TableCell align="center">  {assignment.assigned_name}</TableCell>
                                <TableCell align="center"> {assignment.status}</TableCell>
                                <TableCell align="center"> {convert(assignment?.assigned_at)}</TableCell>
                                <TableCell align="center">
                                    <Button sx={{ mr: 1 }} size='small' variant="contained" onClick={() => {
                                        navigate('/dashboard/assignment/' + assignment.id);
                                    }}>View</Button>

                                    <Tooltip title="Delete" onClick={() => { handleClickOpen(assignment) }}>
                                        <IconButton>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>)
                    })}
                </TableBody>
            </Table>
        </TableContainer>

        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Please confirm delete?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {/* Please confirm delete? */}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { handleClose('no') }}>No</Button>
                <Button onClick={() => { handleClose('yes') }} autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>

    </div >)

}

const FvName = (props) => {
    const [name, setName] = useState();
    const getFvName = async () => {
        const snapshot = await getDoc(doc(database, "field_verifier", props.uid));
        setName(snapshot.data().name);
    }
    useEffect(() => {
        getFvName();
    });
    return (<div>
        {name}
    </div>)
}

export default AssignmentsPage;