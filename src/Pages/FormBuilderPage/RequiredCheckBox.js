import { Checkbox } from "@mui/material";
import { useFormBuilderContext } from "../../Providers/FormBuilderProvider";

const RequiredCheckBox = (props) => {
  const { state, dispatch } = useFormBuilderContext();
  return (
    <div >
      <Checkbox
        sx={{
          color: "white",
          "&.Mui-checked": {
            color: "white",
          },
        }}
        size="small"
        checked={
          state.pages[props.page_id].fields[props.field_id].required ?? false
        }
        onChange={(val) => {
          console.log(
            state.pages[props.page_id].fields[props.field_id].required
          );
          console.log(val.target.checked);
          dispatch({
            type: "markRequired",
            payload: {
              page_id: props.page_id,
              field_id: props.field_id,
              required: val.target.checked,
            },
          });
        }}
      />
      <label style={{fontSize: '12px', color: "white" }}>*Required</label>
    </div>
  );
};

export default RequiredCheckBox;
