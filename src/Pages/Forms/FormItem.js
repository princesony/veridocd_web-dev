import React, { useState } from "react";
import {
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { database } from "../../Firebase/Firebase";
import { useAuthContext } from "../../Providers/AuthProvider";
import { useDraftAssignmentContext } from "../../Providers/DraftAssignmentProvider";
import { useFormBuilderContext } from "../../Providers/FormBuilderProvider";
import { useToastProvider } from "../../Providers/ToastProvider";
import { ArrowRightAltOutlined } from "@mui/icons-material";

const FormItem = (props) => {
  const navigate = useNavigate();
  const { setForm } = useDraftAssignmentContext();
  const { user } = useAuthContext();
  const { dispatch, setMode } = useFormBuilderContext();
  const { showSuccess, showError } = useToastProvider();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDeleteConfirmation = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  const deleteForm = async () => {
    // Perform delete operation here
    try {
      await deleteDoc(doc(database, "agency/" + user.uid, "forms/" + props.id));
      showSuccess("Successfully Deleted Form " + props.form_id);
    } catch (error) {
      showError();
    }
    setOpenDeleteDialog(false);
  };

  return (
    <div>
      <div
        style={{
          height: "47px",
          width: "100%",
          display: "inline-flex",
          alignItems: "center",
          fontSize: "14px",
          color: "gray",
          fontFamily: "Source Serif Pro, serif",
          justifyContent: "center",
        }}
      >
        <div>
          {/* Your existing code */}

          {/* Delete Confirmation Dialog */}
          <Dialog open={openDeleteDialog} onClose={handleDeleteCancel}>
            <DialogTitle>Delete Form</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this form?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCancel} color="primary">
                Cancel
              </Button>
              <Button onClick={deleteForm} color="secondary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <Grid container>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {props.form_id}
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            {props.name}
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {props.mode === "select" ? (
              <Button
                size="small"
                onClick={() => {
                  setForm(props.form);
                  props.setOpen(false);
                }}
                variant="outlined"
                sx={{
                  color: "white",
                  bgcolor: "#1260cc",
                  borderRadius: "17px",
                  fontSize: "10px",
                  fontWeight: "bold",
                  padding: "0.5em 1.3em 0.5em 0.8em",
                  border: "1.3px solid #1260cc",
                  "&:disabled": {
                    bgcolor: "#eaeaea",
                    border: "1.3px solid #eaeaea",
                    color: "#aeaeae",
                  },
                  "&:hover": {
                    border: "1.3px solid #1260cc",
                    color: "white",
                    bgcolor: "#5D89C7",
                  },
                }}
              >
                <ArrowRightAltOutlined
                  fontSize="small"
                  sx={{
                    transform: "scale(0.8)",
                    marginRight: "0.2em",
                  }}
                />
                Choose
              </Button>
            ) : (
              <div style={{ display: "inline" }}>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    display: "inline",
                    margin: "0 0.4em",
                  }}
                  onClick={() => {
                    setMode("edit");
                    dispatch({ type: "loadForm", payload: props.form });
                    navigate("/dashboard/formBuilderPage", {
                      state: { mode: "edit" },
                    });
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenDeleteDialog(true);
                  }}
                  size="small"
                  sx={{
                    margin: "0 0.4em",
                    backgroundColor: "red",
                    display: "inline",
                    "&:hover": {
                      backgroundColor: "darkred",
                    },
                  }}
                >
                  Delete
                </Button>
              </div>
            )}
          </Grid>
        </Grid>
      </div>
      <hr
        style={{
          width: "95%",
          margin: "0 auto",
          border: "0.6px solid #dedede",
        }}
      />
    </div>
  );
};

export default FormItem;
