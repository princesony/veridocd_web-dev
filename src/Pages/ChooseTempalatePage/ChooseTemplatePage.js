import { Grid } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormBuilderContext } from "../../Providers/FormBuilderProvider";
import TemplateItem from "./TemplateItem";
import {ClipLoader} from "react-spinners";


const ChooseTemplatePage = () => {
    const [templates, setTemplates] = useState([]);

    const navigate = useNavigate();
    const {dispatch} = useFormBuilderContext();

    const [isLoading, setIsLoading] = useState(false);
    const {state} = useLocation();
    const {mode} = state;

    const changeScreen = async (template) => {
        template.id = null;
        dispatch({type: 'loadForm', payload: template})
        navigate('/dashboard/formBuilderPage');
    }

    const {setMode} = useFormBuilderContext();

    const getData = async () => {
        setIsLoading(true);
        let data = [];
        await axios.get('https://veridocs.pythonanywhere.com/api/templates', {
            headers: {
                "Content-type": "application/json"
            }
        }).then(res => {
            res.data.forEach((temp) => {
                data.push(temp);
            })
            setTemplates(data);
            setIsLoading(false);
        }).catch(err => {
            console.log(err)
            setIsLoading(false);
        })
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        isLoading ? <div style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}><ClipLoader/></div> : <div>
            <Grid container sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
            }}>
                {templates.map((template) => {
                    return (<Grid item key={template.id} xs={12} sm={4} md={3} lg={2} sx={{
                        margin: '0.3em',
                        display: 'inline',
                        maxWidth: '200px'
                    }}>
                        <div onClick={() => {
                            setMode(mode === 'edit' ? 'create' : mode);
                            changeScreen(template);
                        }}>
                            <TemplateItem temp={template} />
                        </div>
                        
                    </Grid>)
                })}
            </Grid>
        </div>
    );
}

export default ChooseTemplatePage;