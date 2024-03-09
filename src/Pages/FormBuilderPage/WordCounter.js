import { MenuItem, TextField } from "@mui/material";
import { useFormBuilderContext } from "../../Providers/FormBuilderProvider";

const WordCounter = (props) => {
  const { state, dispatch } = useFormBuilderContext();

  const wordCount = [20, 50, 100, 300, 500];

  return (
    <div
      style={{
        margin: "1em",
      }}
    >
      <TextField
        select
        fullWidth
        variant="standard"
        size="small"
        sx={{
          color: "white",
        }}
        SelectProps={{
          sx: {
            backgroundColor: "transparent",
            "&:focus": {
              backgroundColor: "transparent",
            },
          },
        }}
        InputProps={{
          sx: {
            backgroundColor: "transparent",
            "&:focus": {
              backgroundColor: "transparent",
            },
          },
        }}
        label="Number of Words"
        value={state.pages[props.page_id].fields[props.field_id].length ?? 10}
        onChange={(val) => {
          dispatch({
            type: "changeNoOfWords",
            payload: {
              page_id: props.page_id,
              field_id: props.field_id,
              length: val.target.value,
            },
          });
        }}
      >
        {wordCount.map((count, index) => (
          <MenuItem key={index} value={count}>
            {count}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default WordCounter;
