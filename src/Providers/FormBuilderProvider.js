import { createContext, useContext, useState } from "react";
import { useAsyncReducer, useLocalState } from "./../Utils/CustomHooks";
import Form from "../Models/FormModel";
import Field from "../Models/FieldModel";
import { database, realtimeDB } from "../Firebase/Firebase";
import { ref, set } from "firebase/database";
import { useAuthContext } from "./AuthProvider";
import axios from "axios";
import { doc, setDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { useToastProvider } from "./ToastProvider";

const FormBuilderContext = createContext();
const form = new Form("new form", { name: "new form", pages: [] });

export const FormBuilderProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [formId, setFormId] = useLocalState("id");
  const [mode, setMode] = useLocalState("mode", "create");
  const [preview, setPreview] = useState(false);
  const { showSuccess, showError } = useToastProvider();
  let initialState = form.getState();
  const [changed, setChanged] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState({
    status: false,
  });

  const saveForm = async () => {
    if (formId === null || formId === undefined) {
      setLoadingStatus({
        status: true,
        message: "Creating..",
      });

          await addDoc(
            collection(database, `agency/${user.uid}/forms`),
            {
              name: state.name,
              data: state.pages,
            }
          )
            .then(() => {
              showSuccess("Form Saved Successfully");
            })
            .catch((err) => {
              console.log(err)
              showError();
            });
      setLoadingStatus({
        status: false,
      });
    } else {
      updateForm();
    }
    setChanged(false);
    return form.getState();
  };

  const updateForm = async () => {
    setLoadingStatus({
      status: true,
      message: "Updating.",
    });
    await axios
      // .put(
      //   "https://veridocs.pythonanywhere.com/api/form/update/" + formId,
      //   {
      //     name: state.name,
      //     data: state.pages,
      //     createdBy: user.uid,
      //   },
      //   {
      //     headers: {
      //       "Content-type": "application/json",
      //     },
      //   }
      // )
      // .then(async (res) => {

      // })
      
      // .catch((err) => {
      //   console.log(err);
      // });


      await updateDoc(
        doc(database, "agency/" + user.uid, "forms/" + formId),
        {
          name: state.name,
          data: state.pages,
        }
      )
        .then(() => {
          showSuccess("Form Updated successfully");
        })
        .catch((err) => {
          showError();
        });


    setLoadingStatus({
      status: false,
    });
    return form.getState();
  };

  const loadForm = (template) => {
    if (template.id !== null && template.id !== undefined) {
      setFormId(template.id);
    }
    sessionStorage.setItem(
      "form",
      JSON.stringify({
        name: template.name,
        pages: template.data ?? [],
      })
    );
    form.setFormState(template);
    return form.getState();
  };

  const notifyDatabase = () => {
    // setChanged(true);
    // sessionStorage.setItem("form", JSON.stringify(form.getState()));
    // if (preview) {
    //   set(ref(realtimeDB, "forms/" + user.uid), form.getState())
    //     .then(() => {})
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // }
  };

  const changeFormName = (payload) => {
    form.name = payload.name;
    notifyDatabase();
    return form.getState();
  };

  const addPage = () => {
    form.addPage();
    notifyDatabase();
    return form.getState();
  };

  const deletePage = (payload) => {
    form.deletePage(payload.page_id);
    notifyDatabase();
    return form.getState();
  };

  const addField = (payload) => {
    let field = new Field("label", "text-input");
    form.pages[payload.page_id].fields.push(Object.assign({}, field));
    form.pages[payload.page_id].fields.forEach(
      (field, index) => (field.id = index)
    );
    notifyDatabase();
    return form.getState();
  };

  const deleteField = (payload) => {
    form.pages[payload.page_id].fields = form.pages[
      payload.page_id
    ].fields.filter((field) => {
      return field.id !== payload.field_id;
    });
    form.pages[payload.page_id].fields.forEach(
      (field, index) => (field.id = index)
    );
    notifyDatabase();
    return form.getState();
  };

  const changeLabel = (payload) => {
    form.pages[payload.page_id].fields[payload.field_id].label = payload.label;
    form.pages[payload.page_id].fields.forEach(
      (field, index) => (field.id = index)
    );
    notifyDatabase();
    return form.getState();
  };

  const changeWidget = (payload) => {
    let label = form.pages[payload.page_id].fields[payload.field_id].label;
    form.pages[payload.page_id].fields[payload.field_id] = {
      label: label,
      widget: payload.widget,
    };
    form.pages[payload.page_id].fields.forEach(
      (field, index) => (field.id = index)
    );
    notifyDatabase();
    return form.getState();
  };

  const changeNoOfWords = (payload) => {
    form.pages[payload.page_id].fields[payload.field_id].length =
      payload.length;
    form.pages[payload.page_id].fields.forEach(
      (field, index) => (field.id = index)
    );
    notifyDatabase();
    return form.getState();
  };

  const changeDropDownOptions = (payload) => {
    if (
      form.pages[payload.page_id].fields[payload.field_id].options ===
        undefined ||
      form.pages[payload.page_id].fields[payload.field_id].options === null
    ) {
      form.pages[payload.page_id].fields[payload.field_id].options = [
        { value: payload.option, id: 0 },
      ];
    } else {
      form.pages[payload.page_id].fields[payload.field_id].options.push({
        value: payload.option,
      });
      form.pages[payload.page_id].fields[payload.field_id].options.forEach(
        (option, index) => (option.id = index)
      );
    }

    form.pages[payload.page_id].fields.forEach(
      (field, index) => (field.id = index)
    );
    notifyDatabase();
    return form.getState();
  };

  const changeExtensionName = (payload) => {
    form.pages[payload.page_id].fields[payload.field_id].extensions.forEach(
      (extension) => {
        if (extension.id === payload.extension_id) {
          extension.value = payload.extension;
        }
      }
    );
    notifyDatabase();
    return form.getState();
  };

  const changeOptionName = (payload) => {
    form.pages[payload.page_id].fields[payload.field_id].options.forEach(
      (option) => {
        if (option.id === payload.option_id) {
          option.value = payload.option;
        }
      }
    );
    notifyDatabase();
    return form.getState();
  };

  const changeFileExtensions = (payload) => {
    if (
      form.pages[payload.page_id].fields[payload.field_id].extensions ===
        undefined ||
      form.pages[payload.page_id].fields[payload.field_id].extensions === null
    ) {
      form.pages[payload.page_id].fields[payload.field_id].extensions = [
        { value: payload.extension, id: 0 },
      ];
    } else {
      form.pages[payload.page_id].fields[payload.field_id].extensions.push({
        value: payload.extension,
      });
      form.pages[payload.page_id].fields[payload.field_id].extensions.forEach(
        (extension, index) => (extension.id = index)
      );
    }

    form.pages[payload.page_id].fields.forEach(
      (field, index) => (field.id = index)
    );
    notifyDatabase();
    return form.getState();
  };

  const markRequired = (payload) => {
    form.pages[payload.page_id].fields[payload.field_id].required =
      payload.required;
    form.pages[payload.page_id].fields.forEach(
      (field, index) => (field.id = index)
    );
    notifyDatabase();
    return form.getState();
  };

  const markMultiLined = (payload) => {
    form.pages[payload.page_id].fields[payload.field_id].multi_line =
      payload.multi_line;
    form.pages[payload.page_id].fields.forEach(
      (field, index) => (field.id = index)
    );
    notifyDatabase();
    return form.getState();
  };

  const deleteDropDownOption = (payload) => {
    form.pages[payload.page_id].fields[payload.field_id].options = form.pages[
      payload.page_id
    ].fields[payload.field_id].options.filter(
      (option) => option.id !== payload.option_id
    );
    form.pages[payload.page_id].fields[payload.field_id].options.forEach(
      (option, index) => (option.id = index)
    );
    notifyDatabase();
    return form.getState();
  };

  const deleteFileExtension = (payload) => {
    form.pages[payload.page_id].fields[payload.field_id].extensions =
      form.pages[payload.page_id].fields[payload.field_id].extensions.filter(
        (extension) => extension.id !== payload.extension_id
      );
    form.pages[payload.page_id].fields[payload.field_id].extensions.forEach(
      (extension, index) => (extension.id = index)
    );
    notifyDatabase();
    return form.getState();
  };

  const changeTableRows = (payload) => {
    if (
      form.pages[payload.page_id].fields[payload.field_id].rows === undefined ||
      form.pages[payload.page_id].fields[payload.field_id].rows === null
    ) {
      form.pages[payload.page_id].fields[payload.field_id].rows = [
        { label: payload.label, id: 0 },
      ];
    } else {
      form.pages[payload.page_id].fields[payload.field_id].rows.push({
        label: payload.label,
      });
      form.pages[payload.page_id].fields[payload.field_id].rows.forEach(
        (row, index) => (row.id = index)
      );
    }

    form.pages[payload.page_id].fields.forEach(
      (field, index) => (field.id = index)
    );
    notifyDatabase();
    return form.getState();
  };

  const changeTableColumns = (payload) => {
    if (
      form.pages[payload.page_id].fields[payload.field_id].columns ===
        undefined ||
      form.pages[payload.page_id].fields[payload.field_id].columns === null
    ) {
      form.pages[payload.page_id].fields[payload.field_id].columns = [
        { label: payload.label, id: 0 },
      ];
    } else {
      form.pages[payload.page_id].fields[payload.field_id].columns.push({
        label: payload.label,
      });
      form.pages[payload.page_id].fields[payload.field_id].columns.forEach(
        (column, index) => (column.id = index)
      );
    }

    form.pages[payload.page_id].fields.forEach(
      (field, index) => (field.id = index)
    );
    notifyDatabase();
    return form.getState();
  };

  const deleteTableRow = (payload) => {
    form.pages[payload.page_id].fields[payload.field_id].rows = form.pages[
      payload.page_id
    ].fields[payload.field_id].rows.filter((row) => row.id !== payload.row_id);
    form.pages[payload.page_id].fields[payload.field_id].rows.forEach(
      (row, index) => (row.id = index)
    );
    notifyDatabase();
    return form.getState();
  };

  const deleteTableColumn = (payload) => {
    form.pages[payload.page_id].fields[payload.field_id].columns = form.pages[
      payload.page_id
    ].fields[payload.field_id].columns.filter(
      (column) => column.id !== payload.column_id
    );
    form.pages[payload.page_id].fields[payload.field_id].columns.forEach(
      (column, index) => (column.id = index)
    );
    notifyDatabase();
    return form.getState();
  };

  const changeTableColumnLabel = (payload) => {
    form.pages[payload.page_id].fields[payload.field_id].columns.forEach(
      (column) => {
        if (column.id === payload.column_id) {
          column.label = payload.label;
        }
      }
    );
    notifyDatabase();
    return form.getState();
  };

  const changeTableRowLabel = (payload) => {
    form.pages[payload.page_id].fields[payload.field_id].rows.forEach((row) => {
      if (row.id === payload.row_id) {
        row.label = payload.label;
      }
    });
    notifyDatabase();
    return form.getState();
  };

  const changeTableRowWidget = (payload) => {
    form.pages[payload.page_id].fields[payload.field_id].rows.forEach((row) => {
      if (row.id === payload.row_id) {
        row.widget = payload.widget;
      }
    });
    notifyDatabase();
    return form.getState();
  };

  const changeTableColumnWidget = (payload) => {
    form.pages[payload.page_id].fields[payload.field_id].columns.forEach(
      (column) => {
        if (column.id === payload.column_id) {
          column.widget = payload.widget;
        }
      }
    );
    notifyDatabase();
    return form.getState();
  };

  const addStartDate = (payload) => {
    form.pages[payload.page_id].fields[payload.field_id].start_date =
      payload.start_date;
    notifyDatabase();
    return form.getState();
  };

  const addEndDate = (payload) => {
    form.pages[payload.page_id].fields[payload.field_id].end_date =
      payload.end_date;
    notifyDatabase();
    return form.getState();
  };

  const reorder = (payload) => {
    let copy = form.pages[payload.page_id].fields;
    let item = copy.splice(payload.start, 1);
    copy.splice(payload.end, 0, item[0]);
    form.pages[payload.page_id].fields = copy;
    form.pages[payload.page_id].fields.forEach(
      (field, index) => (field.id = index)
    );
    notifyDatabase();
    return form.getState();
  };

  const changeComment = (payload) => {
    form.pages[payload.page_id].fields[payload.field_id].comment =
      payload.value;
    form.pages[payload.page_id].fields.forEach(
      (field, index) => (field.id = index)
    );
    notifyDatabase();
    return form.getState();
  };

  const changeValue = (payload) => {
    form.pages[payload.page_id].fields[payload.field_id].value = payload.value;
    form.pages[payload.page_id].fields.forEach(
      (field, index) => (field.id = index)
    );
    notifyDatabase();
    return form.getState();
  };

  const changePageName = (paylaod) => {
    form.pages[paylaod.page_id].name = paylaod.value;
    notifyDatabase();
    return form.getState();
  }

  const reducer = async (state, action) => {
    switch (action.type) {
      case "changeFormName":
        return changeFormName(action.payload);
      case "addPage":
        return addPage();
      case "deletePage":
        return deletePage(action.payload);
      case "addField":
        return addField(action.payload);
      case "deleteField":
        return deleteField(action.payload);
      case "changeLabel":
        return changeLabel(action.payload);
      case "changeWidget":
        return changeWidget(action.payload);
      case "markRequired":
        return markRequired(action.payload);
      case "markMultiLined":
        return markMultiLined(action.payload);
      case "changeNoOfWords":
        return changeNoOfWords(action.payload);
      case "changeDropDownOptions":
        return changeDropDownOptions(action.payload);
      case "changeOptionName":
        return changeOptionName(action.payload);
      case "deleteDropDownOption":
        return deleteDropDownOption(action.payload);
      case "changeFileExtensions":
        return changeFileExtensions(action.payload);
      case "deleteFileExtension":
        return deleteFileExtension(action.payload);
      case "changeExtensionName":
        return changeExtensionName(action.payload);
      case "deleteTableColumn":
        return deleteTableColumn(action.payload);
      case "deleteTableRow":
        return deleteTableRow(action.payload);
      case "changeTableRows":
        return changeTableRows(action.payload);
      case "changeTableColumns":
        return changeTableColumns(action.payload);
      case "changeTableColumnLabel":
        return changeTableColumnLabel(action.payload);
      case "changeTableRowLabel":
        return changeTableRowLabel(action.payload);
      case "changeTableRowWidget":
        return changeTableRowWidget(action.payload);
      case "changeTableColumnWidget":
        return changeTableColumnWidget(action.payload);
      case "addStartDate":
        return addStartDate(action.payload);
      case "addEndDate":
        return addEndDate(action.payload);
      case "saveForm":
        return saveForm();
      case "loadForm":
        return loadForm(action.payload);
      case "reorder":
        return reorder(action.payload);
      case "changeComment":
        return changeComment(action.payload);
      case "changeValue":
        return changeValue(action.payload);
      case "changePageName":
        return changePageName(action.payload);
      default:
        throw Error;
    }
  };

  const [state, dispatch] = useAsyncReducer(reducer, initialState);

  return (
    <FormBuilderContext.Provider
      value={{
        state,
        dispatch,
        preview,
        setPreview,
        setFormId,
        saveForm,
        formId,
        mode,
        setMode,
        loadingStatus,
        changed,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
};

export const useFormBuilderContext = () => {
  return useContext(FormBuilderContext);
};