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
import CompetitionPreview from "./CompetitionPreview";
import Container from "@mui/material/Container";
import {useNavigate} from "react-router-dom";

function Competition(props) {
    let navigate = useNavigate();

    const deleteCompetition = () => {
        fetch(`/api/competition/${document.location.href.split('/')[4]}`, {
            method: "DELETE",
            credentials: "include"
        })
            .then(res => {
                console.log(res)
                if (res.status === 200) {
                    props.showAlert('success', 'Соревнование успешно удалено')
                    navigate('/application/my',{replace: true});
                } else if (res.status === 401) {
                    navigate(`/login`,{replace: true})
                } else {
                    props.showAlert('error', 'Соревнование не удалено. Обратитесь к администратору')
                }
            })
    }

    const downloadFile = () => {
        fetch(`/api/competition/${document.location.href.split('/')[4]}/finalize`, {
            credentials: "include"
        })
            .then(res => {
                if (res.status === 200) {
                    return res.arrayBuffer()
                } else if (res.status === 401) {
                    navigate(`/login`,{replace: true})
                } else {
                    throw res.json()
                }
            })
            .then((response) => {
                console.log('download file start')
                console.log(response);
                let blob = new Blob([response], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `TEAMS_SETUP.xlsx`;
                link.click();
            })
    }
    return (
        <Box display="flex"
             flex={1}
             flexDirection='column'
             sx={{height: '100%'}}
        >
            <CompetitionPreview id={document.location.href.split('/')[4]}/>
            <Divider variant={"fullWidth"} orientation={'horizontal'} sx={{marginBottom: 2}}/>
            <Box sx={{marginTop: "auto", marginBottom: 1, display: 'flex', justifyContent: 'center'}}>
                <Button
                    size={'large'}
                    variant={'contained'}
                    endIcon={<DeleteForeverIcon/>}
                    onClick={deleteCompetition}
                    color="error"
                >
                    Удалить соревнование
                </Button>
                <Button
                    size={'large'}
                    sx={{marginLeft: 4}}
                    variant={'contained'}
                    endIcon={<DeleteForeverIcon/>}
                    onClick={() => navigate('new',{replace: false})}
                    color="success"
                >
                    Подать заявку
                </Button>
                <Button
                    size={'large'}
                    sx={{marginLeft: 4}}
                    variant={'contained'}
                    endIcon={<DeleteForeverIcon/>}
                    onClick={downloadFile}
                    color="primary"
                >
                    Скачать TEAMS_SETUP
                </Button>
            </Box>
        </Box>
    )

}

export default Competition
