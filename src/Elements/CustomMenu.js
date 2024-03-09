import styled from "@emotion/styled";
import { ListItemIcon, Menu, MenuItem } from "@mui/material";


export const CustomMenu = styled((props) => <Menu {...props}
elevation={7}
/>)(({theme}) => ({
  '.MuiMenu-paper': {
    marginTop: '0.5em',
    borderRadius: 7,
    border: '1.3px solid #e0e0e0'
  },
  'MuiMenu-list': {
    mt: '0.7em 0',
    display: 'flex',
    alignItems: 'center'
  }
}));

export const CustomMenuIcon = styled((props) => <ListItemIcon
{...props}/>)({
  color: 'black',
  scale: '0.85'
});

export const CustomMenuItem = styled((props) => <MenuItem
  {...props}/>)({
    borderRadius: '5px',
    margin: '0.4em',
    display: 'flex',
    color: 'black',
    fontWeight: 'light',
    alignItems: 'center'
});