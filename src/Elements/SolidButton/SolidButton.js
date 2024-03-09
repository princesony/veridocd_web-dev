import React from "react";
import { Button } from "@mui/material";

const SolidButton = (props) => {
    return (
        <div style={{
            display: props.display ?? 'block',
            margin: '20px'
        }}>
            <Button variant={props.variant ?? "contained"} error={"error"} disabled={props.disabled ?? false} size={props.size}
              onClick={props.onPress}
              sx={{
                  borderWidth: '2px',
                  '&:hover': {
                      borderWidth: '2px'
                  }}}
              id={props.id ?? ''}
            >{props.label}</Button>
        </div>
    );
}

export default SolidButton;