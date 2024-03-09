import { getDownloadURL, getMetadata, ref } from "firebase/storage"
import { storage } from "../Firebase/Firebase"

export const getUrl = async (fileRef) => {
    return await getMetadata(ref(storage, fileRef)).then(async metaData => {
        return await getDownloadURL(ref(storage, fileRef )).then(url => {
            console.log(fileRef);
            return url;
        });
    });
}