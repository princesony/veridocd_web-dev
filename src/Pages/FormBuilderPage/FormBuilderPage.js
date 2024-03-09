import { Add, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useFormBuilderContext } from "../../Providers/FormBuilderProvider";
import PageItem from "./PageItem/PageItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDraftAssignmentContext } from "../../Providers/DraftAssignmentProvider";
import { useNavigate } from "react-router-dom";
import { usePrompt } from "../../Utils/CustomHooks";

const FormBuilderPage = () => {
  const { setForm } = useDraftAssignmentContext();
  const navigate = useNavigate();
  const formNameRef = useRef(null);
  const [cursorPos, setCursorPos] = useState();
  const {
    state,
    dispatch,
    preview,
    setPreview,
    loadingStatus,
    changed,
    setMode,
    setFormId,
    formId,
    mode
  } = useFormBuilderContext();
  useEffect(() => {}, [cursorPos]);
  usePrompt("Changes will not be saved!\nAre you sure to leave?", changed, [
    "/dashboard/pageBuilder",
  ]);

  return (
    <div>
      <div
        style={{
          margin: "1.6em",
          width: "100%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ width: "10%", display: "inline" }}>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </Box>
        <div style={{ display: "inline" }}>
          <div
            style={{
              margin: "0 0.3em",
              fontSize: "13px",
              fontWeight: "bold",
              display: "inline",
            }}
          >
            ID
          </div>
          <div style={{ display: "inline" }}> {formId ?? "Empty"}</div>
        </div>
        <Box sx={{ width: "30%", display: "inline" }}>
          <TextField
            id="formName"
            size="small"
            label="Form Name"
            sx={{ margin: "0 0.3em" }}
            inputRef={formNameRef}
            value={state.name}
            onChange={(event) => {
              setCursorPos(event.target.selectionStart);
              dispatch({
                type: "changeFormName",
                payload: { name: event.target.value },
              });
            }}
          />
        </Box>
        <Box sx={{ width: "26%", display: "inline-flex" }}>
          <Tooltip title={preview ? "Hide Preview" : "Show Preview"}>
            <IconButton
              onClick={() => {
                setPreview((data) => !data);
              }}
            >
              {preview ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Tooltip>
          {loadingStatus.status ? (
            <div>
              <Button>{loadingStatus.message}</Button>
            </div>
          ) : (
            <div>
              {mode === "select" ? (
                <Tooltip title="Choose Form">
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      margin: "0.4em",
                    }}
                    onClick={() => {
                      // erasing id of previously loaded form
                      setFormId(null);

                      // loading the new form
                      setForm({ name: state.name, data: state.pages });

                      // navigating back to create assignment page
                      navigate("/dashboard/assignment/create");

                      // erasing the form id
                      setFormId(null);

                      // resetting form builder in create mode
                      setMode("create");
                    }}
                  >
                    Assign
                  </Button>
                </Tooltip>
              ) : null}
              {mode === "create" ? (
                <Tooltip title="Create Form" arrow>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ margin: "0.4em" }}
                    onClick={async () => {
                      dispatch({ type: "saveForm" });
                    }}
                  >
                    Save
                  </Button>
                </Tooltip>
              ) : null}
              {mode === "edit" ? (
                <Tooltip title="Update Form" arrow>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ margin: "0.4em" }}
                    onClick={async () => {
                      dispatch({ type: "saveForm" });
                    }}
                  >
                    Update
                  </Button>
                </Tooltip>
              ) : null}
            </div>
          )}
        </Box>
      </div>

      <div
        style={{
          textAlign: "center",
        }}
      >
        {state.pages.map((page, index) => (
          <PageItem page={page} key={index} />
        ))}
        <div
          style={{
            margin: "0.3em",
            display: "inline-flex",
          }}
        >
          <Tooltip title="Add page">
            <Paper
              onClick={() => dispatch({ type: "addPage" })}
              variant="outlined"
              sx={{
                width: "16em",
                height: "9em",
                "&:hover": {
                  backgroundColor: "whitesmoke",
                },
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Add sx={{ color: "lightgrey" }} />
              </div>
            </Paper>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default FormBuilderPage;
