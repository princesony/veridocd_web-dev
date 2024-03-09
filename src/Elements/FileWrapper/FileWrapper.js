import { Download } from '@mui/icons-material';
import { Button } from '@mui/material';
import './Filewrapper.css';

export const FileWrapper = ({url, name, height}) => {
  return (
    <div style={{
      border: '1.6px solid gray'
    }}>
      <h3 className="play-fair">{name}
      <div>
        <Button sx={{
          margin: '0 0.6em'
        }} className='button' variant='outlined' size='small' onClick={() => {
          window.open(url);
        }}>See Full</Button>
        <Button className='button' variant='contained' download={true}
          size='small' href={url}><Download/>Download</Button>
      </div>
      </h3>
      
    <div className='main'
    style={{
      backgroundImage: `url(${url})`,
      height: height ?? '300px'
    }}/>
  </div>);
}