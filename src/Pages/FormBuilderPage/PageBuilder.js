import { Add, ArrowBackIosNew } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormBuilderContext } from "../../Providers/FormBuilderProvider";
import FieldItem from "./FieldItem";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { usePrompt } from "../../Utils/CustomHooks";
import { StyledTextField } from "../../Elements/CustomTextField/CustomTextField";

const PageBuilder = (props) => {
  const { id } = useParams();
  const { state, dispatch, changed } = useFormBuilderContext();
  const navigate = useNavigate();

  const chooseHeight = (widget) => {
    switch (widget) {
      case "dropdown":
        return "150px";
      default:
        return "60px";
    }
  };

  usePrompt("Changes will not be saved!\nAre you sure to leave?", changed, [
    "/dashboard/formBuilder",
  ]);

  return (
    <div>
      <StyledTextField
        label="Page Name"
        border={true}
        onChange={(event) => {
          dispatch({
            type: "changePageName",
            payload: { value: event.target.value, page_id: id },
          });
        }}
        value={state.pages[parseInt(id)].name ?? `Page ${parseInt(id) + 1}`}
      />

      <div style={{ margin: "1em 0.5em" }}>
        <IconButton
          onClick={() => {
            navigate("/dashboard/formBuilderPage");
          }}
        >
          <ArrowBackIosNew size="small" />
        </IconButton>
      </div>

      <DragDropContext
        onDragEnd={(event) => {
          dispatch({
            type: "reorder",
            payload: {
              page_id: id,
              start: event.source.index,
              end: event.destination.index,
            },
          });
        }}
      >
        <Droppable droppableId="fields">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {state.pages[id].fields.map((field, index) => {
                return (
                  <Draggable
                    index={index}
                    key={index}
                    draggableId={String(index)}
                  >
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <FieldItem
                          key={index}
                          id={id}
                          index={index}
                          height={() => chooseHeight(field.widget)}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <IconButton
        sx={{
          margin: "0 0.5em",
          border: "0.3px solid gray",
        }}
        onClick={() => {
          dispatch({ type: "addField", payload: { page_id: id } });
        }}
      >
        <Add />
      </IconButton>
    </div>
  );
};

export default PageBuilder;
