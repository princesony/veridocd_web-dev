import { Grid, Paper } from "@mui/material";
import { collection, DocumentData, onSnapshot, query, where } from "firebase/firestore";
import React from "react";
import { useEffect, useState } from "react";
import { database } from "../../Firebase/Firebase";
import { useAuthContext } from "../../Providers/AuthProvider";
import ApprovedAssignmentDetails from './ApprovedElement.tsx';

const ApprovedAssignments: React.FunctionComponent = () => {
    const {user} = useAuthContext();
    const [mounted, setMounted] = useState(false);
    const [submittedAss, setSubmittedAss] = useState<DocumentData>([]);
    useEffect(() => {
        setMounted(true);
        return () => {
            setMounted(false);
        }
    }, []);
    useEffect(() => {
        let unsubscribe = () => {};
        if (user !== null && user.uid !== undefined) {
            unsubscribe = onSnapshot(query(collection(database, 'assignments'),
            where('status', '==', 'approved'),
            where('agency', '==', user.uid),
            ), snapshot => {
                let ass : Array<DocumentData> = [];
                snapshot.docs.forEach((doc) => {
                    ass.push({ ...doc.data(), id: doc.id});
                });

                console.log(ass)
                setSubmittedAss(ass);
            });
        }
        return () => {
            return unsubscribe();
        }
    }, [mounted, user]);
    return (
        <div>
            <Paper elevation={0} sx={{
                    width: "100%",
                    padding: '0.4em',
                    margin: '0.3em 0',
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
                            <div style={{color: 'gray', fontWeight: 'bold'}}>
                                ID
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={2} md={2} sx={{
                            display: 'flex', justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <div style={{color: 'gray', fontWeight: 'bold'}}>
                                Form Name
                            </div>
                        </Grid>

                        <Grid item xs={12} sm={12} lg={4} md={4} sx={{
                            display: 'flex', justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <div style={{color: 'gray', fontWeight: 'bold'}}>
                                Verifier  Name
                            </div>
                        </Grid>
                        
                        <Grid item xs={12} sm={12} lg={2} md={2} sx={{
                            display: 'flex', justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <div style={{color: 'gray', fontWeight: 'bold'}}>
                                Action
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
                <hr style={{width: '93%', margin: '0 auto 0.15em auto', border: '0.6px solid #dedede'}}/>
            {submittedAss.map((assignment) => {
            return (<div key={assignment.id}>
                    <ApprovedAssignmentDetails
                      id={assignment.id}
                      assigned_to={assignment.assigned_to}
                      assigned_name={assignment.assigned_name}
                      form_name={assignment.formName}
                    />
        <hr style={{width: '93%', margin: '0 auto 0.15em auto', border: '0.6px solid #dedede'}}/>
            </div>)
        })}
        </div>
    );
}

export default ApprovedAssignments;