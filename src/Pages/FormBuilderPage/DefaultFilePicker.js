import { Button } from "@mui/material";
import { useFormBuilderContext } from "../../Providers/FormBuilderProvider";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useToastProvider } from "../../Providers/ToastProvider";

const DefaultFilePicker = ({ id, index }) => {
  const { showError, showSuccess } = useToastProvider();
  const { dispatch, state } = useFormBuilderContext();

  const storage = getStorage();

  const uploadFile = ({ type, payload }) => {

    if ((payload.file.size / 1000) > 1000) {
      showError("File should be less than 1000 kb");
    }

    const storageRef = ref(storage, 'formDefault/' + payload.fileName);
    const uploadTask = uploadBytesResumable(storageRef, payload.file);

    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
        // showSuccess("uploading...");
        switch (snapshot.state) {
          case 'paused':
            // console.log('Upload is paused');
            break;
          case 'running':
            // console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            showError("Failed to upload");
            break;
          case 'storage/canceled':
            // User canceled the upload
            showError("Failed to upload");
            break;
          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            showError("Failed to upload");
            break;
        }
      },
      (snapshot) => {
        showSuccess("Uploaded");
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

          payload.value = downloadURL;
          dispatch({ type, payload });
        });
      }
    );

  }

  return (
    <div>
      <Button
        fullWidth
        variant="outlined"
        sx={{
          margin: "1em 1em 0 0",
          padding: "0.6em",
          borderRadius: "23px",
          borderColor: "#4dc3c8",
          "&:hover": {
            borderColor: "#349ca0",
          },
        }}
        component="label"
      >
        {state.pages[id].fields[index].value === undefined ? (
          "Browse Files"
        ) : (
          <div
            style={{
              maxWidth: "200px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {state.pages[id].fields[index].value}
          </div>
        )}
        <input
          accept={state.pages[id].fields[index].extensions?.map((ext) => ext)}
          onChange={(e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadFile({
              type: "changeValue",
              payload: {
                page_id: id,
                field_id: index,
                value: e.target.files[0].name,
                fileName: e.target.files[0].name,
                file: e.target.files[0],
              },
            });
          }}
          hidden
          type="file"
        />
      </Button>
    </div>
  );
};

export default DefaultFilePicker;
