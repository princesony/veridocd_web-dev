import { collection, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { database } from "../Firebase/Firebase";

const WidgetTypeContext = createContext();

export const WidgetTypeProvider = ({ children }) => {
  const [widgets, setWidgets] = useState([]);
  const [tableWidgets, setTableWidgets] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(database, "form_widgets"),
      (snapshot) => {
        let data = [];
        snapshot.docs.forEach((doc, index) => {
          data.push({ ...doc.data(), value: index });
        });
        setWidgets(data);
        setTableWidgets([
          "date-time",
          "text-input",
          "toggle-input",
          "address",
          "file",
        ]);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <WidgetTypeContext.Provider value={{ widgets, tableWidgets }}>
      {children}
    </WidgetTypeContext.Provider>
  );
};

export const useWidgetTypeContext = () => {
  return useContext(WidgetTypeContext);
};