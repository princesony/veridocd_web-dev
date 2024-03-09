import { TextField } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { useFormBuilderContext } from "../../Providers/FormBuilderProvider"

export const StartDatePickerWidget = (props) => {
    
    const {state, dispatch} = useFormBuilderContext();

    return (<LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker sx={{
            transform: 'scale(0.1)',
        }} label={props.label} renderInput={(params) => <TextField size="small" {...params}/>}
            size='small' onChange={(value) => {
            dispatch({type: 'addStartDate', payload: {page_id: props.page_id,
                field_id: props.field_id, start_date: `${value.$y}-${value.$M}-${value.$D}`}});
        }} value={state.pages[props.page_id].fields[props.field_id].start_date ?? ''}
        inputFormat='DD/MM/YYYY'/>
    </LocalizationProvider>)
}



export const EndDatePickerWidget = (props) => {
    
    const {state, dispatch} = useFormBuilderContext();

    return (<LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker label={props.label} renderInput={(params) => <TextField size="small" {...params}/>} size='small' onChange={(value) => {
            dispatch({type: 'addEndDate', payload: {page_id: props.page_id,
                field_id: props.field_id, end_date: `${value.$y}-${value.$M}-${value.$D}`}});
        }} value={state.pages[props.page_id].fields[props.field_id].end_date ?? ''}
        inputFormat='DD/MM/YYYY'/>
    </LocalizationProvider>)
}