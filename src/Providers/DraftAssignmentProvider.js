import { doc, setDoc, serverTimestamp} from "firebase/firestore";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { database } from "../Firebase/Firebase";
import { generateAssignmentId } from "../Utils/AssignmentIdGenerator";
import { useAlertBoxContext } from "./AlertBoxProvider";
import { useAuthContext } from "./AuthProvider";
import { useToastProvider } from "./ToastProvider";

const DraftAssignmentContext = createContext();

export const documentTypes = [
  {
    name: "Educational Form",
    template: {
      persons: ["Applicant"],
      // files: [{ name: "Aadhar Card" }, { name: "Pan Card" }],
    },
  },
  {
    name: "Payout Verification Form",
    template: {
      persons: ["Applicant"],
      // files: [{ name: "Aadhar Card" }, { name: "Pan Card" }],
    },
  },
  {
    name: "Death Claim Form",
    template: {
      persons: ["Applicant"],
      // files: [
      //   { name: "Aadhar Card" },
      //   { name: "Pan Card" },
      //   { name: "Death Certificate" },
      // ],
    },
  },
];

export const DraftAssignmentProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [fvList, setFvList] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const { showSuccess, showError, showWarning } = useToastProvider();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({});
  const [template, setTemplate] = useState({
    persons: ["Applicant"],
    // files: [
    //   {
    //     name: "Aadhar Card",
    //   },
    //   {
    //     name: "Pan Card",
    //   },
    // ],
  });
  const personsRef = useRef([]);
  const filesRef = useRef([]);
  const [assignment, setAssignment] = useState({
    assigned_to: "",
    stage: 'configure'
  });
  const { showDialog, submitRef, cancelRef } = useAlertBoxContext();
  const saveDraftAssignment = async () => {
    setIsSavingDraft(true);
    // await updateDoc(doc(database, "agency", user.uid), {
    //   draft_assignment: {
    //     assignment: assignment,
    //     form: form,
    //   },
    // })
    //   .then((snapshot) => {
    //     showSuccess("Draft Assignement Saved");
    //     setIsSavingDraft(false);
    //   })
    //   .catch((err) => {
    //     showError();
    //   });

    let updatedAssignment = {
      ...assignment,
      persons: template.persons.map((person, index) => ({
        name: person,
        details: personsRef.current[index].getData(),
      })),
    };
    setAssignment(updatedAssignment);
    window.localStorage.setItem(
      "draft_assignment",
      JSON.stringify(updatedAssignment)
    );
    window.localStorage.setItem("draft_fvs", JSON.stringify(fvList));
    window.localStorage.setItem("draft_form", JSON.stringify(form));
    setIsSavingDraft(false);
  };

  const clearForm = () => {
    if (Object.entries(form).length === 0) {
      showError("No Form to Remove!");
      return;
    }
    showSuccess("Form Removed");
    setForm({});
  };

  const clearFv = () => {
    if (
      assignment.assigned_to === undefined ||
      assignment.assigned_to === null
    ) {
      showError("No Field Verifier Chosen");
      return;
    }
    setAssignment((prev) => ({ ...prev, assigned_to: null }));
    showSuccess("Field Verifier Removed");
  };

  const saveAssignment = async () => {
    
    let valid = true;
    personsRef.current.forEach((ref, index) => {
      if ((personsRef.current[index] !== null) | undefined) {
        if (!personsRef.current[index].isValid()) {
          valid = valid && false;
        }
      }
    });
    filesRef.current.forEach((ref, index) => {
      if ((filesRef.current[index] !== null) | undefined) {
        if (!filesRef.current[index].isValid()) {
          valid = valid && false;
        }
      }
    });
    if (!valid) {
      showError("Please fill all fields");
      return;
    }
    if (Object.entries(form).length === 0) {
      showError("Please choose a Form");
      return;
    }
    if (fvList.length === 0) {
      showError("Please choose a Field Verifier");
      return;
    }
    showDialog({
      title: "Proceed to Asssign",
      message: "Are you sure you want to assign this assignment?",
    });
    cancelRef.current.onclick = () => {
      showWarning("Assignment Submit Cancelled!");
      cancelRef.current.onclick = () => {};
    };
    submitRef.current.onclick = async () => {
      const date = new Date();
      setIsSaved(true);
      fvList.forEach(async (fv) => {
        var assId = generateAssignmentId();
        await setDoc(
          doc(database, "agency/" + user.uid, "assignments/" + assId),
          {
            assigned_to: fv.name,
            created_at: serverTimestamp(),
            document_type: assignment.document_type,
            status: "assigned",
            fvId: fv.uid,
            formName : form.name,
            formId : form.id,
          }
        )
          .then(async (snapshot) => {
            await setDoc(doc(database, "assignments", assId), {
              agency: user.uid,
              persons: template.persons.map((person, index) => ({
                person: person,
                details: personsRef.current[index].getData(),
              })),
              // files: template.files.map((file, index) => ({
              //   name: file.name,
              //   ref: filesRef.current[index].getData(),
              // })),
              assigned_to: fv.uid,
              assigned_name: fv.name,
              assigned_at: serverTimestamp(),
              status: "assigned",
              formId : form.id,
              formName : form.name,
              history: [
                {
                  status: "assigned",
                  date: `${date.getDate()}/${
                    date.getMonth() + 1
                  }/${date.getFullYear()}`,
                },
              ],
            })
              .then(async (snapshot) => {
                await setDoc(
                  doc(database, "assignments/" + assId, "form_data/data"),
                  { ...form }
                )
                  .then(async (snapshot) => {
                    await setDoc(
                      doc(
                        database,
                        "field_verifier/" + fv.uid,
                        "assignments/" + assId
                      ),
                      {
                        formId: form.id,
                        formName: form.name,
                        agency: user.uid,
                        applicant_name:
                          personsRef.current[0].getData()["fName"],
                        applicant_phone:
                          personsRef.current[0].getData()["phone"],
                        // applicant_city: personsRef.current[0].getData()["city"],
                        // applicant_state:
                        //   personsRef.current[0].getData()["state"],
                        // applicant_pincode:
                        //   personsRef.current[0].getData()["pincode"],
                        document_type: assignment.document_type,
                        assigned_at: `${date.getDate()}/${
                          date.getMonth() + 1
                        }/${date.getFullYear()}`,
                        assigned_at_timestamp: serverTimestamp(),
                        status: "assigned",
                      }
                    )
                      .then((snap) => {
                        showSuccess("Assignemnt assigned to " + fv.name);
                      })
                      .catch((err) => {
                        showError(err);
                        setIsSaved(false);
                      });
                    submitRef.current.onclick = () => {};
                    setIsSaved(false);
                  })
                  .catch((err) => {
                    showError(err);
                    setIsSaved(false);
                  });
              })
              .catch((err) => {
                showError(err);
                setIsSaved(false);
              });
          })
          .catch((err) => {
            showError(err);
            setIsSaved(false);
          });
      });
    };
  };

  const getAssignment = () => {
    let prev = window.localStorage.getItem("draft_assignment");
    let prevFvs = window.localStorage.getItem("draft_fvs");
    let prevForm = window.localStorage.getItem("draft_form");
    setAssignment(JSON.parse(prev) ?? { document_type: "" });
    setFvList(JSON.parse(prevFvs) ?? []);
    setForm(JSON.parse(prevForm) ?? {});
    setIsLoading(false);
  };

  useEffect(() => {
    if (
      mounted === true &&
      user !== null &&
      user.uid !== null &&
      user.uid !== undefined
    ) {
      setIsLoading(true);
      getAssignment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, mounted]);

  return (
    <DraftAssignmentContext.Provider
      value={{
        template,
        isLoading,
        assignment,
        clearForm,
        setAssignment,
        // getFv,
        // fvName,
        setTemplate,
        saveAssignment,
        // gettingFv,
        fvList,
        setFvList,
        isSaved,
        personsRef,
        filesRef,
        clearFv,
        saveDraftAssignment,
        form,
        setForm,
        isSavingDraft,
        setMounted,
      }}
    >
      {children}
    </DraftAssignmentContext.Provider>
  );
};

export const useDraftAssignmentContext = () => {
  return useContext(DraftAssignmentContext);
};
