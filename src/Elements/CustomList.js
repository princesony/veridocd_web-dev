import styled from "@emotion/styled";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

export const StyledListItem = styled(((props) => <ListItem {...props}>
  <ListItemIcon>
    {props.icon}
  </ListItemIcon>
  <ListItemText primaryTypographyProps={{
    fontFamily: 'Roboto, sans-serif',
    fontSize: '14px'
  }} primary={props.primary}/>
</ListItem>), {
  shouldForwardProp: (prop) => prop !== 'highlight'
})(({theme, highlight}) => ({
  backgroundColor: highlight ? '#f7f7f7' : 'white',
  borderRadius: '5px',
  height: '40px',
}));

export const CustomListItem = ({onClick,
    primary, highlight, normalIcon, highlightIcon}) => {
    return <ListItemButton onClick={onClick} sx={{
      backgroundColor: highlight ? '#f7f7f7' : 'white',
      borderRadius: '5px',
      height: '40px'}}>
      <ListItemIcon>
        { highlight ? highlightIcon : normalIcon }
      </ListItemIcon>
      <ListItemText primaryTypographyProps={{
        fontFamily: 'Source Sans Pro, sans-serif',
        fontSize: '14px',
        fontWeight: highlight ? 'bold' : 'normal'
      }} primary={primary}/>
    </ListItemButton>
}
