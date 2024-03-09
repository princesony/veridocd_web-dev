import { Checkbox } from "@mui/material";
import { useFormBuilderContext } from "../../Providers/FormBuilderProvider";

const MultiLined = (props) => {
    const {state, dispatch} = useFormBuilderContext();
    return (
        <div>
            <Checkbox size="small" checked={state.pages[props.page_id].fields[props.field_id].multi_line ?? false}
                onChange={(val) => {
                    dispatch({type: 'markMultiLined', payload: {page_id: props.page_id, field_id: props.field_id, multi_line: val.target.checked}});
                }}
            />
            <label> MultiLined</label>
        </div>
    );
}

export default MultiLined;