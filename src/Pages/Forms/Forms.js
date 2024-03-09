import { Add } from "@mui/icons-material";
import { Grid, IconButton, Tooltip } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormBuilderContext } from "../../Providers/FormBuilderProvider";
import { useFormsContext } from "../../Providers/FormsProvider";
import FormItem from "./FormItem";

const Forms = () => {
    const {forms} = useFormsContext();

    const navigate = useNavigate();
    const {state } = useLocation();
    const {setFormId} = useFormBuilderContext();
    
    const {mode} = state;

    return (<div>
      <div style={{
            height: '30px',
            fontWeight: 'bold',
            fontSize: '12px',
            width: '100%',
            display: 'inline-flex',
            cursor: 'pointer',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Grid container >
                <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', color: '#404040'}}>
                    Form ID
                </Grid>
                <Grid item xs={4} sx={{display: 'flex', justifyContent: 'start', color: '#404040'}}>
                    Form Name
                </Grid>
                <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', color: '#404040'}}>
                    Action
                </Grid>
            </Grid>
        </div>
        <hr style={{width: '93%', margin: '0 auto', border: '0.6px solid #dedede'}}/>
      {forms.map((form, index) => (
      <FormItem key={index} form_id={index+5000} id={form.id} name={form.name} form={form} mode={mode}/>))}
      {/* <Tooltip title="Create new Form" arrow>
        <IconButton sx={{
          border: '1px solid grey',
          margin: '0.3em'
        }} onClick={() => {
          setFormId(null);
          navigate('/dashboard/chooseTemplate', {state: {mode: mode}});
        }}>
          <Add />
        </IconButton>
      </Tooltip>
       */}
    </div>);
}


export default Forms;