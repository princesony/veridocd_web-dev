import { Warning } from '@mui/icons-material';
import { Button, Fade, Paper, Zoom } from '@mui/material';
import React, { forwardRef } from 'react';
import { useAlertBoxContext } from '../../Providers/AlertBoxProvider';
import './AlertBox.css';

const AlertBox = forwardRef(({title, message, submitRef,
    cancelRef, submitLabel}) => {

    const {show, setShow} = useAlertBoxContext();

    return (
        <Fade in={show}><div className='alert-box' style={{
        }} onClick={
            () => setShow(prev => !prev)}>
            <Zoom in={show} ><Paper sx={{
                minWidth: '300px',
                maxHeight: '250px',
                minHeight: '200px',
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column'
            }}>
                 <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: '100000000',
                    flexGrow: '3',
                    fontWeight: 'bold',
                    padding: '1em',
                    fontSize: '21px'
                }}><Warning sx={{margin: '0 0.7em'}}/>{ title}</div>
                <div style={{
                    display: 'flex',
                    padding: '0 2em',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: '5',
                }}>{message}</div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    flexGrow: '1',
                }}>
                    <Button ref={cancelRef}>Cancel</Button>
                    <Button ref={submitRef}>{submitLabel ?? 'Submit'}</Button></div>
            </Paper></Zoom>
        </div></Fade>
    );
})

export default AlertBox;