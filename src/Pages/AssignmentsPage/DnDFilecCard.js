import { AttachmentRounded, Delete } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import UploadProgressBar from "../../Elements/UploadStatus.tsx";

const DnDFileCard = forwardRef((props, ref) => {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]);
    const [err, setErr] = useState(false);
    useImperativeHandle(ref, () => ({
        isValid: () => {
            let valid = files.length !== 0;
            if (!valid) {
                setErr(true);
            } else {
                setErr(false);
            }
            return valid;
        },
        getData: () => filesRef.current.map(
            (file) => file.getRef()
        )
    }));
    const filesRef = useRef([]);
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        setFiles(prev => [...prev, ...e.dataTransfer.files]);
    }
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }
    return (<section>
        <div style={{
            marginTop: '1em',
            display: 'flex',
            fontFamily: 'Playfair Display',
            fontSize: '23px',
        }}>
            <AttachmentRounded sx={{
                marginX: '0.5em',
                color: '#4dc3c8',
                alignSelf: 'center'
            }} />
            {props.name}</div>
        <div style={{
            borderRadius: '3px',
            margin: '0.5em 0.5em 1em 0.5em',
            border: dragActive ? '' : '1px dashed black',
            height: '200px',
            display: 'grid',
            backgroundColor: dragActive ? '#f0f0f0' : '#ffffff',
            alignContent: 'center'
        }}
            onDragEnter={handleDrag}
            onDrop={handleDrop}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}>
            {dragActive ? <div style={{
                justifySelf: 'center'
            }}>
                Drop here to start uploading
            </div> : <div style={{
                justifySelf: 'center',
                marginX: 'auto'
            }}>
                Drag and Drop the file
                <div style={{
                    padding: '0.3em',
                    textAlign: 'center'
                }}>
                    or
                </div>
            </div>}
            {dragActive ? null : <Button variant="contained" sx={{
                marginX: 'auto',
                borderRadius: '23px',
                bgcolor: '#4dc3c8',
                '&:hover': {
                    bgcolor: '#349ca0'
                }
            }} component="label" disableElevation>
                Browse Files
                <input onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(e.target.files[0]);
                    setFiles(prev => [...prev, ...e.target.files]);
                }} multiple hidden type="file" />
            </Button>}
        </div>
        {dragActive ? null : <div style={{
            margin: '0.5em 0 1em 0.5em'
        }}>
            {files.map((file, index) => <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px'
            }} key={index}>
                <div onClick={() => {
                }} style={{ width: '100%', display: 'flex' }}>
                    <UploadProgressBar ref={
                        fe => (filesRef.current[index] = fe)
                    } file={file} />
                </div>
                <IconButton color="error" sx={{ scale: '0.9' }} size="small"
                    onClick={async () => {
                        await filesRef.current[index].deleteFile()
                            .then(() => {
                                setFiles(files.filter((f) => (
                                    file.name !== f.name)));
                            }).catch((err) => {
                                console.log(err);
                            });
                    }}>
                    <Delete fontSize="small" />
                </IconButton>
            </div>)}
        </div>}
        {err ? <div style={{color: 'red', fontSize: '12px', marginLeft: '1em'}}>
            Add at least one file
        </div> : null}
    </section>);
});

export default DnDFileCard;