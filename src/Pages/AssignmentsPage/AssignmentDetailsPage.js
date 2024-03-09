import { Box, Button, Grid, Paper, Step, StepContent, StepLabel, Stepper, Typography } from "@mui/material";
import { } from "@mui/system";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { database } from "../../Firebase/Firebase";
import './AssignmentDetailsPage.css';

const AssignmentDetailsPage = () => {

  const [assignment, setAssignment] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [historySummary, setHistorySummary] = useState([]);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({});
  const [fv, setFv] = useState("");
  const getForm = async () => {
    const snapshot1 = await getDoc(doc(database, "assignments/" + id, "form_data/data"));
    const snapshot2 = await getDoc(doc(database, "assignments/" + id, "form_data/result"));
    setForm({ data: snapshot1.data(), response: snapshot2.data() ?? {} });
  }
  const getFv = async (fvId) => {
    const snapshot = await getDoc(doc(database, "field_verifier", fvId));
    setFv(snapshot.data().name);
  }
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onSnapshot(doc(database, "assignments", id),
      { includeMetadataChanges: true },
      snapshot => {
        setAssignment({ ...snapshot.data(), id: snapshot.id });
        getFv(snapshot.data().assigned_to);
        getForm();
        setHistory(snapshot.data().history);
        if (snapshot.data()?.history?.length > 3) {
          setHistorySummary(snapshot.data().history.slice(- 4, -1))
        } else {
          setHistorySummary(snapshot.data().history);
        }
        setIsLoading(false);
      }
    )
    return () => {
      unsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return !isLoading ? (<div>
    <div style={{
      display: 'flex',
      width: '100%'
    }}>
      <div className="data" style={{ width: '100%', justifyContent: 'center', display: 'flex', margin: '2em 1em' }}>
        <Stepper activeStep={assignment?.history?.length}>
          {historySummary.map((event, index) => {
            return <Step key={index} >
              <StepLabel>{event.status}
                <Typography fontFamily="Roboto Slab" fontSize="12px">
                  {event.date}
                </Typography>
              </StepLabel>
            </Step>
          })}
        </Stepper>
      </div></div>



    {assignment.persons.map((item, index) => (
      <div>

        <div style={{
          fontSize: '19px',
          fontWeight: 'bold',
          fontFamily: 'Playfair Display, serif'
        }}>{item.person} Details</div>

        <hr style={{ margin: '0.4em 0 2em 0', border: '0.2px solid #ededed' }} />

        <Grid container sx={{
          borderRadius: '3px',
          border: '1px solid grey',
          fontSize: '16px',
          marginBottom: '1em',
          fontWeight: 'bold',
          color: '#606060',
          borderBottomColor: 'transparent',
          width: '100%',
        }}>
          {Object.entries(item.details).map(([key, value]) => (
            <Grid item lg={6} style={{
              display: 'flex', borderBottom: '1px solid grey',
              width: '100%'
            }}>
              <div style={{
                color: 'grey', height: '100%', backgroundColor: 'whitesmoke',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                minWidth: '25%'
              }}>
                {key}
              </div>
              <div className="data" style={{ width: '100%', justifyContent: 'center', display: 'flex', margin: '0.5em' }}>
                {value}
              </div>
            </Grid>
          ))}
        </Grid>

        <br></br>

      </div>
    ))}


    <Box>
      <Paper variant="outlined" sx={{ margin: '1.3em 0', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{
          height: '100%', backgroundColor: 'whitesmoke',
          padding: '0.7em 0',
          alignItems: 'center',
          display: 'flex',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#707070',
          justifyContent: 'center',
          minWidth: '12.5%'
        }}>
          Field Verifier
        </div>

        <div style={{
          fontFamily: 'Source Serif Pro, serif',
          justifyContent: 'center', display: 'flex', margin: '0.5em 0', width: '100%'
        }}>
          {fv ?? "No Field Verifier Assigned"}
        </div>
        <div style={{
          justifyContent: 'space-evenly', display: 'flex',
          margin: '0.5em 0', width: '15%'
        }}>
          {assignment.assigned_to === null || assignment.assigned_to === undefined
            || assignment.assigned_to === "" ? null
            : <Button variant="contained" size="small" onClick={() => {
              navigate('/dashboard/fieldVerifier/' + assignment.assigned_to, {
                state: { mode: 'view' }
              });
            }}>Details</Button>}
        </div>
      </Paper>
      <Paper variant="outlined" sx={{ margin: '1.3em 0', display: 'flex' }}>
        <div style={{
          height: '100%', backgroundColor: 'whitesmoke',
          padding: '0.7em 0',
          alignItems: 'center',
          display: 'flex',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#707070',
          justifyContent: 'center',
          minWidth: '12.5%'
        }}>
          Form
        </div>
        <div style={{
          fontFamily: 'Source Serif pro, serif',
          justifyContent: 'center', display: 'flex', margin: '0.5em 0', width: '100%'
        }}>
          {form.data?.name === undefined || form.data?.name === null ? "No form Chosen" : form.data?.name}
        </div>
        <div style={{ justifyContent: 'center', display: 'flex', margin: '0.5em 0', width: '15%' }}>
          {form.data?.name !== null && form.data?.name !== undefined ? <Button size="small"
            onClick={() => {
              navigate('/dashboard/assignment/response/', {
                state: {
                  id: id
                }
              });
            }}
            variant="contained">Details</Button> : null}
        </div>

      </Paper>
    </Box>
  </div>) : <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100vh',
  }}><ClipLoader loading={true} size={30} /></div>
}

export default AssignmentDetailsPage;