import { collection, doc, getDocs, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { database } from "../Firebase/Firebase";

export const getCollection = async (location) => {
    return await getDocs(collection(database, location));
}

export const getDocumentStream = async (location, id, onSuccess, onError) => {
    return onSnapshot(doc(database, location, id),
      (doc) => {
          console.log(doc);
          onSuccess(doc);
      }, (error) => {
          console.log(error);
          onError(error);
      }
    );
}

export const setDocument = async (location, value) => {
    return await setDoc(collection(database, location), value);
}

export const getQuerySnapshots = async (location, queryKey, queryValue) => {
    const q = query(database, location, where(queryKey, "==", queryValue));
    return getDocs(q);
}