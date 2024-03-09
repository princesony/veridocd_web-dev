import { Box, Button, Grid, IconButton, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Clear } from '@mui/icons-material';
import { useFormBuilderContext } from "../../Providers/FormBuilderProvider";
import { useWidgetTypeContext } from "../../Providers/WidgetTypeProvider";

const TableMaker = (props) => {

    const {state, dispatch} = useFormBuilderContext();
    const {tableWidgets} = useWidgetTypeContext();

    return (<Box sx={{width: '90%'}}>
        <Grid container>
            <Grid item xs={12} md={6}>
                <Box sx={{
                    display: 'block',
                    justifyContent: 'center',
                    margin: '2em',
                }}>
                    <Typography>
                        Rows
                    </Typography>
                    {state.pages[props.page_id].fields[props.field_id].rows?.map((row, index) => {
                        return (<div key={index} style={{margin: '0.7em 0',
                         width: '100%', display: 'inline-flex', justifyContent: 'space-between'}}>
                            <TextField size="small" defaultValue={state.pages[props.page_id].fields[props.field_id].rows[index].label ?? ''}
                                label={`Row Item ${index + 1}`}
                                onChange={(value) => {
                                    dispatch({type: 'changeTableRowLabel', payload: {
                                        page_id: props.page_id, field_id: props.field_id,
                                        row_id: index, label: value.target.value
                                    }});
                            }} sx={{
                                width: '60%'
                            }}/>
                        <Select value={state.pages[props.page_id].fields[props.field_id].rows[index].widget ?? ''}
                            onChange={(value) => {
                                dispatch({type: 'changeTableRowWidget', payload: {page_id: props.page_id,
                                field_id: props.field_id, row_id: index, widget: value.target.value}});
                            }} size="small" sx={{marginLeft: '0.3em'}}>
                              {tableWidgets.map((widget, index) => {
                                return (<MenuItem value={widget} key={index}>
                                  {widget}
                                </MenuItem>)
                              })}
                            </Select>
                            <IconButton sx={{transform: 'scale(0.7)'}} onClick={() => {
                                dispatch({type: 'deleteTableRow', payload: {page_id: props.page_id,
                                    field_id: props.field_id, row_id: index
                                }});
                            }}>
                                <Clear/>
                            </IconButton>
                        </div>)
                    })}
                    <Button variant="outlined" size="small" sx={{margin: '0.7em 0'}}
                      onClick={() => {
                        dispatch({type: 'changeTableRows', payload: {page_id: props.page_id, 
                        field_id: props.field_id, label: ""}});
                      }}>
                        Add Row
                    </Button>
                </Box>
            </Grid>
            <Grid item xs={12} md={6}>
                <Box sx={{
                    display: 'block',
                    justifyContent: 'center',
                    margin: '2em',
                }}>
                    <Typography>
                        Columns
                    </Typography>
                    {state.pages[props.page_id].fields[props.field_id].columns?.map((column, index) => {
                        return (<div key={index} style={{margin: '0.7em 0', 
                          width: '100%', display: 'inline-flex', justifyContent: 'space-between'}}>
                            <TextField size="small" defaultValue={state.pages[props.page_id].fields[props.field_id].columns[index].label ?? ''}
                            label={`Column Item ${index+1}`}
                            onChange={(value) => {
                                dispatch({type: 'changeTableColumnLabel', payload: {
                                    page_id: props.page_id, field_id: props.field_id,
                                    column_id: index, label: value.target.value
                                }});
                            
                            }} sx={{
                                width: '60%'
                            }}/>
                            <Select value={state.pages[props.page_id].fields[props.field_id].columns[index].widget ?? ''}
                            onChange={(value) => {
                                dispatch({type: 'changeTableColumnWidget', payload: {page_id: props.page_id,
                                field_id: props.field_id, column_id: index, widget: value.target.value}});
                            }} size="small" sx={{marginLeft: '0.3em'}}>
                              {tableWidgets.map((widget, index) => {
                                return (<MenuItem value={widget} key={index}>
                                  {widget}
                                </MenuItem>)
                              })}
                            </Select>
                            <IconButton sx={{transform: 'scale(0.7)'}} onClick={() => {
                                dispatch({type: 'deleteTableColumn', payload: {page_id: props.page_id,
                                    field_id: props.field_id, column_id: index
                                }});
                            }}>
                                <Clear/>
                            </IconButton>
                        </div>)
                    })}
                    <Button variant="outlined" size="small" sx={{margin: '0.7em 0'}}
                      onClick={() => {
                        dispatch({type: 'changeTableColumns', payload: {page_id: props.page_id, 
                        field_id: props.field_id, label: ""}});
                      }}>Add Column</Button>
                </Box>

            </Grid>
        </Grid>
    </Box>);
}

export default TableMaker;