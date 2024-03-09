import { useLocation } from "react-router-dom";

const ResultPage = (props) => {
    const {state} = useLocation();
    const {id} = state;

    return (
        <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
        <iframe src={'https://veridocsformviewer.web.app/#/result/' + id}
        title={'form response ' + props.id ?? id.id}
        style={{
            border: 'none',
            width: '450px',
            height: '70vh'
        }}>
        </iframe></div>
    )
}

export default ResultPage;