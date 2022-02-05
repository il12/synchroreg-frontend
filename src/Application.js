import React, {useEffect, useState} from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
    Divider,
    FormLabel,
    IconButton,
    Input, InputLabel,
    ListItem,
    ListItemText, Select,
    Step,
    StepContent,
    StepLabel,
    Stepper, TextField
} from "@mui/material";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import SendIcon from "@mui/icons-material/Send";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import List from "@mui/material/List";
import MenuItem from "@mui/material/MenuItem";
import ruLocale from 'date-fns/locale/ru';
import {formatDistance, parse, format} from 'date-fns'
import AddTaskIcon from '@mui/icons-material/AddTask';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ApplicationPreview from "./ApplicationPreview";
import Container from "@mui/material/Container";
import {useNavigate} from "react-router-dom";

function Application(props) {
    const [application, setApplication] = useState(false)
    const [competition, setCompetition] = useState(false)
    const navigate = useNavigate();

    const deleteApplication = () => {
        fetch(`/api/application/${document.location.href.split('/')[4]}`, {
            method: "DELETE",
            credentials: "include"
        })
            .then(res => {
                console.log(res)
                if (res.status === 200) {
                    props.showAlert('success', 'Заявка успешно удалена')
                    navigate(`/application/my`,{replace: true})
                } else if (res.status === 401) {
                    navigate(`/login`,{replace: true})
                } else {
                    props.showAlert('error', 'Заявка не удалена. Обратитесь к администратору')
                }
            })
    }


    useEffect(() => {
        fetch(`/api/application/${document.location.href.split('/')[4]}`, {
            credentials: "include"
        })
            .then(res => {
                console.log(res)
                if (res.status === 200) {
                    return res.json()
                } else if (res.status === 401) {
                    navigate(`/login`,{replace: true})
                } else {
                    throw res.json()
                }
            })
            .then((response) => {
                console.log(response.data);
                setApplication(JSON.parse(response.data.json))
                setCompetition(response.data);
            });
    }, [])

    return (
        <Container sx={{display: 'flex', flexDirection:'column', height: '100%'}}>
            <Typography component={"h3"} variant={"h5"} textAlign={"center"}>
                {competition?.name}
            </Typography>
            <ApplicationPreview sx={{flex: 1}} application={application}/>
            <Button
                size={'large'}
                sx={{marginTop: "auto", marginBottom: theme=>theme.spacing(1)}}
                variant={'contained'}
                endIcon={<DeleteForeverIcon/>}
                onClick={deleteApplication}
                color="error"
            >
                Удалить заявку
            </Button>
        </Container>
    )

}

export default Application
