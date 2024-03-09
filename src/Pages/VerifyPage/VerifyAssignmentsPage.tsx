import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Button, Grid, Paper } from "@mui/material";
import { collection, doc, DocumentData, getDoc, onSnapshot, query, where } from "firebase/firestore";
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../Firebase/Firebase";
import { useAuthContext } from "../../Providers/AuthProvider";

const VerifyAssignmentsPage: React.FunctionComponent = () => {
    const { user } = useAuthContext();
    const [mounted, setMounted] = useState(false);
    const [submittedAss, setSubmittedAss] = useState<DocumentData>([]);

    useEffect(() => {
        setMounted(true);
        return () => {
            setMounted(false);
        }
    }, []);

    useEffect(() => {
        let unsubscribe = () => { };
        if (user !== null && user.uid !== undefined) {
            unsubscribe = onSnapshot(query(collection(database, 'assignments'),
                where('agency', '==', user.uid),
                where('status', '==', 'submitted')
            ), snapshot => {
                let ass: Array<DocumentData> = [];
                snapshot.docs.forEach((doc) => {
                    ass.push({ ...doc.data(), id: doc.id });
                });
                console.log(ass)
                setSubmittedAss(ass);
            });
        }
        return () => {
            return unsubscribe();
        }
    }, [mounted, user]);
    const navigate = useNavigate();
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
                        <div style={{ color: 'gray', fontWeight: 'bold' }}>
                            ID
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={2} md={2} sx={{
                        display: 'flex', justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <div style={{ color: 'gray', fontWeight: 'bold' }}>
                            Form Name
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={4} md={4} sx={{
                        display: 'flex', justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <div style={{ color: 'gray', fontWeight: 'bold' }}>
                            Verifier Name
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={2} md={2} sx={{
                        display: 'flex', justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <div style={{ color: 'gray', fontWeight: 'bold' }}>
                            Action
                        </div>
                    </Grid>
                </Grid>
            </Paper>
            <hr style={{ width: '93%', margin: '0 auto 0.15em auto', border: '0.6px solid #dedede' }} />
            {submittedAss.map((assignment) => {
                return (<div key={assignment.id}>
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
                                <div style={{ marginLeft: '1.7em', fontFamily: 'Source Serif Pro, serif' }}>
                                    {assignment.id}
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} lg={2} md={2} sx={{
                                display: 'flex', justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <div style={{ marginLeft: '1.7em', fontFamily: 'Source Serif Pro, serif' }}>
                                    {assignment.formName}
                                </div>
                            </Grid>

                            <Grid item xs={12} sm={12} lg={4} md={4} sx={{
                                display: 'flex', justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <div style={{ marginLeft: '1.7em', fontFamily: 'Source Serif Pro, serif' }}>
                                    {assignment.assigned_name}
                                    {/* <FvName uid={assignment.assigned_to}/> */}
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} lg={2} md={2} sx={{
                                display: 'flex', justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Button size='small' variant="contained" onClick={() => {
                                    navigate('/dashboard/verify/result',
                                        {
                                            state: {
                                                id: assignment.id,
                                                fv: assignment.assigned_to,
                                                fvId: assignment.fvId,
                                                docType: assignment.document_type
                                            }
                                        }
                                    );
                                }}>
                                    Verify
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                    <hr style={{ width: '93%', margin: '0 auto 0.15em auto', border: '0.6px solid #dedede' }} />
                </div>)
            })}
        </div>
    );
}

interface FvProps {
    uid: string
}

const FvName: React.FunctionComponent<FvProps> = (props): ReactJSXElement => {
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

export default VerifyAssignmentsPage;