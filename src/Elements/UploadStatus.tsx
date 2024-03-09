import React, {ReactNode, useImperativeHandle, useState} from 'react';
import { CircularProgress } from "@mui/material";
import { deleteObject, StorageError, uploadBytesResumable,
  UploadTaskSnapshot, ref as strgRef } from "firebase/storage";
import { storage } from '../Firebase/Firebase';
import { useToastProvider } from '../Providers/ToastProvider';
import { useAuthContext } from '../Providers/AuthProvider';

interface Props {
  children?: ReactNode;
  file: File;
}
export type Handle = {
  deleteFile: () => Promise<void>
}

const UploadProgressBar = React.forwardRef<Handle, Props>((props, ref) : JSX.Element => {
    const {showError, showSuccess} = useToastProvider();
  const [status, setStatus] = useState<number>(0);
  const [sRef, setSRef] = useState<string>();
    const {user} = useAuthContext();
    const deleteFile = async () => {
      const storageRef = strgRef(storage, user.uid + '/' + props.file.name);
      await deleteObject(storageRef);
    }
    useImperativeHandle(ref, () => ({
      deleteFile: async () => {
        await deleteFile();
      },
      getRef: () => sRef
    }));
    React.useEffect(() => {
        const storageRef = strgRef(storage, user.uid + '/' + props.file.name);
        const uploadTask = uploadBytesResumable(storageRef, props.file);
        uploadTask.on("state_changed",
          (snapshot : UploadTaskSnapshot) => {
            setStatus(Math.round((snapshot.bytesTransferred / 
            snapshot.totalBytes) * 100));
          },
          (error: StorageError) => {
            showError("Error uplaoding file");
          },
          () => {
            setSRef(storageRef.fullPath);
            showSuccess("Succesfully uploaded " + props.file.name);
          }
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (<div>
        {status !== 100 ? <CircularProgress
        variant='indeterminate' size={20}
        /> : props.file.name}
    </div>);
})

export default UploadProgressBar;