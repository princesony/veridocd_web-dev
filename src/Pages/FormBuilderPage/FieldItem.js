import { Add, Clear, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useFormBuilderContext } from "../../Providers/FormBuilderProvider";
import { useWidgetTypeContext } from "../../Providers/WidgetTypeProvider";
import { EndDatePickerWidget, StartDatePickerWidget } from "./DatePickerWidget";
import MultiLined from "./MultiLined";
import RequiredCheckBox from "./RequiredCheckBox";
import TableMaker from "./TableMaker";
import WordCounter from "./WordCounter";
import { StyledTextField } from "../../Elements/CustomTextField/CustomTextField";
import DefaultFilePicker from "./DefaultFilePicker";

const FieldItem = (props) => {
  const { index, id } = props;
  const { widgets } = useWidgetTypeContext();
  const { state, dispatch } = useFormBuilderContext();
  const [cursorPos, setCursorPos] = useState();
  const [valueCursorPos, setValueCursorPos] = useState();
  const [commentCursorPos, setCommentCursorPos] = useState();

  useEffect(() => {}, [cursorPos, valueCursorPos, commentCursorPos]);

  const labelInputRef = useRef(null);
  const valueInputRef = useRef(null);
  const commentRef = useRef(null);

  return (
    <Paper
      key={index}
      elevation={0}
      variant="outlined"
      sx={{
        marginBottom: "1em",
        paddingBottom: "0.5em",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          backgroundColor: "#4dc3c8",
          height: "40px",
          display: "flex",
          alignItems: "center",
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px",
          marginBottom: "1em",
          justifyContent: "space-between",
          paddingRight: "1em",
        }}
      >
        <div
          style={{
            marginLeft: "1em",
            color: "white",
          }}
        >
          {index + 1}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <div style={{ transform: "scale(0.85)" }}>
            <TextField
              variant="standard"
              size="small"
              sx={{
                color: "white",
              }}
              SelectProps={{
                sx: {
                  color: "white",
                  backgroundColor: "transparent",
                  "&:focus": {
                    backgroundColor: "transparent",
                  },
                },
              }}
              InputProps={{
                sx: {
                  color: "white",
                  backgroundColor: "transparent",
                  "&:focus": {
                    backgroundColor: "transparent",
                  },
                },
              }}
              select
              value={state.pages[id].fields[index].widget ?? ""}
              onChange={(event) => {
                event.preventDefault();
                dispatch({
                  type: "changeWidget",
                  payload: {
                    page_id: id,
                    field_id: index,
                    widget: event.target.value,
                  },
                });
              }}
            >
              {widgets.map((widget, index) => (
                <MenuItem key={index} value={widget.name}>
                  {widget.name.toUpperCase()}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <RequiredCheckBox page_id={id} field_id={index} />
          <IconButton
            sx={{ color: "white" }}
            onClick={() => {
              dispatch({
                type: "deleteField",
                payload: { page_id: id, field_id: index },
              });
            }}
          >
            <Delete />
          </IconButton>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "inline-flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "auto auto",
          }}
        >
          <div style={{ margin: "0 1em" }}>
            <StyledTextField
              size="small"
              label="Label"
              value={state.pages[id].fields[index].label}
              ref={labelInputRef}
              onChange={(event) => {
                event.preventDefault();
                setCursorPos(event.target.selectionStart);
                dispatch({
                  type: "changeLabel",
                  payload: {
                    page_id: id,
                    field_id: index,
                    label: labelInputRef.current.value,
                  },
                });
              }}
            />
          </div>
          <div style={{ margin: "0 1em 0 0" }}>
            {["text", "text-input"].includes(
              state.pages[id].fields[index].widget
            ) ? (
              <StyledTextField
                size="small"
                ref={valueInputRef}
                label="Value"
                value={state.pages[id].fields[index].value}
                onChange={(event) => {
                  event.preventDefault();
                  setValueCursorPos(event.target.selectionStart);
                  dispatch({
                    type: "changeValue",
                    payload: {
                      page_id: id,
                      field_id: index,
                      value: valueInputRef.current.value,
                    },
                  });
                }}
              />
            ) : null}
            {["file", "image"].includes(
              state.pages[id].fields[index].widget
            ) ? (
              <DefaultFilePicker id={id} index={index} />
            ) : null}
          </div>
          <Box>
            {state.pages[id].fields[index].widget === "date-time" ? (
              <div style={{ width: "100%", margin: "0.6em 0" }}>
                <Grid container sx={{ width: "100%" }}>
                  <Grid item md={6}>
                    <StartDatePickerWidget
                      label="Start Date"
                      page_id={id}
                      field_id={index}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <EndDatePickerWidget
                      label="End Date"
                      page_id={id}
                      field_id={index}
                    />
                  </Grid>
                </Grid>
              </div>
            ) : null}
            <div style={{ display: "inline" }}>
              {state.pages[id].fields[index].widget === "text-input" ? (
                <div style={{ width: "100%", display: "flex" }}>
                  <WordCounter page_id={id} field_id={index} />
                  <MultiLined page_id={id} field_id={index} />
                </div>
              ) : null}
            </div>
          </Box>
        </Box>
      </div>
      {state.pages[id].fields[index].widget === "table" ? (
        <TableMaker page_id={id} field_id={index} />
      ) : null}
      {state.pages[id].fields[index].options !== undefined
        ? state.pages[id].fields[index].options.map((option, ind) => {
            return (
              <div
                key={ind}
                style={{
                  width: "90%",
                  margin: "0.4em",
                  padding: "0 0.6em",
                  borderRadius: "2px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      display: "inline",
                      transform: "scale(0.7)",
                    }}
                  >
                    {parseInt(option.id) + 1}
                  </Typography>
                  <TextField
                    label="Option"
                    size="small"
                    defaultValue={
                      state.pages[id].fields[index].options[ind].value
                    }
                    sx={{
                      transform: "scale(0.7)",
                    }}
                    variant="outlined"
                    onChange={(value) => {
                      dispatch({
                        type: "changeOptionName",
                        payload: {
                          page_id: id,
                          field_id: index,
                          option_id: ind,
                          option: value.target.value,
                        },
                      });
                    }}
                  />
                </div>

                <IconButton
                  size="small"
                  onClick={() => {
                    dispatch({
                      type: "deleteDropDownOption",
                      payload: {
                        page_id: id,
                        field_id: index,
                        option_id: ind,
                      },
                    });
                  }}
                  sx={{ transform: "scale(0.7)" }}
                >
                  <Clear />
                </IconButton>
              </div>
            );
          })
        : null}
      <div style={{ width: "90%", display: "flex", justifyContent: "end" }}>
        {state.pages[id].fields[index].widget === "dropdown" ? (
          <Button
            sx={{ margin: "0.7em 0 0 0" }}
            onClick={() => {
              dispatch({
                type: "changeDropDownOptions",
                payload: { page_id: id, field_id: index, option: "" },
              });
            }}
            size="small"
            variant="outlined"
          >
            <Add size="small" />
            Add Option
          </Button>
        ) : null}
      </div>

      {state.pages[id].fields[index].widget === "file" ? (
        <div style={{ margin: "0.7em 0 0.3em 3.2em" }}>Extensions</div>
      ) : null}

      {state.pages[id].fields[index].extensions !== undefined
        ? state.pages[id].fields[index].extensions.map((extension, ind) => {
            return (
              <div
                key={ind}
                style={{
                  width: "90%",
                  margin: "0.4em",
                  padding: "0 0.6em",
                  borderRadius: "2px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      display: "inline",
                      transform: "scale(0.7)",
                    }}
                  >
                    {parseInt(extension.id) + 1}
                  </Typography>
                  <TextField
                    label="Extension"
                    size="small"
                    defaultValue={
                      state.pages[id].fields[index].extensions[ind].value
                    }
                    sx={{
                      transform: "scale(0.7)",
                      width: "170px",
                    }}
                    variant="outlined"
                    onChange={(value) => {
                      dispatch({
                        type: "changeExtensionName",
                        payload: {
                          page_id: id,
                          field_id: index,
                          extension_id: ind,
                          extension: value.target.value,
                        },
                      });
                    }}
                  />
                </div>

                <IconButton
                  size="small"
                  onClick={() => {
                    dispatch({
                      type: "deleteFileExtension",
                      payload: {
                        page_id: id,
                        field_id: index,
                        extension_id: ind,
                      },
                    });
                  }}
                  sx={{ transform: "scale(0.7)" }}
                >
                  <Clear />
                </IconButton>
              </div>
            );
          })
        : null}
      <div style={{ width: "90%", display: "flex", justifyContent: "end" }}>
        {state.pages[id].fields[index].widget === "file" ? (
          <Button
            sx={{ margin: "0.7em 0 1em 0" }}
            onClick={() => {
              dispatch({
                type: "changeFileExtensions",
                payload: {
                  page_id: id,
                  field_id: index,
                  extension: ".pdf",
                },
              });
            }}
            size="small"
            variant="outlined"
          >
            <Add size="small" />
            Add Extension
          </Button>
        ) : null}
      </div>

      <div
        style={{
          margin: "0 1em 1em 1em",
          height: "40px",
          display: "flex",
          alignItems: "center",
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px",
          justifyContent: "end",
        }}
      >
        <StyledTextField
          onChange={(event) => {
            event.preventDefault();
            setCommentCursorPos(event.target.selectionStart);
            dispatch({
              type: "changeComment",
              payload: {
                page_id: id,
                field_id: index,
                value: commentRef.current.value,
              },
            });
          }}
          ref={commentRef}
          value={state.pages[id].fields[index].comment}
          border={true}
          label="Add Comment"
        />
      </div>
    </Paper>
  );
};

export default FieldItem;
