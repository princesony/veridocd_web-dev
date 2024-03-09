import { TextField } from "@mui/material";
import {Controller} from 'react-hook-form';

const ControlledField = ({name, label, control, rules}) => {
    return (
        <Controller
          label={label}
          rules={rules}
          name={name}
          defaultValue=''
          control={control}
          render={({field: {onChange, value}}) => {
            return <TextField
              onChange={onChange} value={value} label={label} size="small"/>
          }}
        />
    );
}

export default ControlledField;