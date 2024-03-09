import { Clear } from '@mui/icons-material';
import { IconButton, Box } from '@mui/material';
import React from 'react';
import './PopUpBox.css'

const PopUpBox = (props, {children}) => {
    return (
        <div className='PopUpWindow' style={{display: 'flex'}}>
            <Box sx={{
                display: 'block',
                width: props.width ?? '80%',
                minWidth: props.minWidth ?? '300px',
                maxWidth: props.maxWidth ?? '480px',
                height: props.height ?? '550px'
            }}>
                <div style={{
                  width: '100%',
                  display: 'inline-flex',
                  justifyContent: 'end',
                }}>
               <IconButton>
                    <Clear />
                  </IconButton>
                </div>
                {props.children}
            </Box>
        </div>
    );
}


export default PopUpBox;