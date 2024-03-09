import { Delete, Edit } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormBuilderContext } from '../../../Providers/FormBuilderProvider';

const FormItem = (props) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const {dispatch} = useFormBuilderContext();

    return (
    <div style={{
        margin: '0.3em',
        display: 'inline-flex',
        }}>
        <Dialog open={open} onClose={() => {
            setOpen(false);
        }}>
            <DialogTitle>
                Are you Sure?
            </DialogTitle>
            <DialogContent sx={{margin: '0.3em 1em'}}>
                <DialogContentText>
                This action will delete page {
                props.page.id + 1}?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button size='small' onClick={() => {
                    setOpen(false);
                }}>Cancel</Button>
                <Button autoFocus size='small' sx={{
                    backgroundColor: 'red',
                    '&:hover': {
                        backgroundColor: 'darkred',
                        color: 'white'
                    },
                    color: 'white'
                }} onClick={() => {
                    dispatch({type: 'deletePage',
                    payload: {page_id: props.page.id}});
                    setOpen(false);
                }}>Delete</Button>
            </DialogActions>
        </Dialog>

        <Paper variant='outlined' sx={{
            'display': 'flex',
            alignItems: 'center',
            '&:hover': {
                backgroundColor: "whitesmoke"
            },
            justifyContent: 'center',
            width: '16em',
            height: '9em'
        }}>
            <div style={{display: 'block'}}>
              {props.page.name ?? `Page ${parseInt(props.page.id) + 1}`}            
            </div>
            <div>
                <Tooltip title="Delete Page" arrow>
                    <IconButton onClick={() => {
                        setOpen(true);
                    }}>
                        <Delete/>
                    </IconButton>
                </Tooltip>
                
                <Tooltip title='Edit Page' arrow>
                    <IconButton onClick={() => {
                      navigate('/dashboard/pageBuilder/' + props.page.id);
                    }}>
                        <Edit/>
                    </IconButton>
                </Tooltip>
                
            </div>
        </Paper>
    </div>);
}

export default FormItem;