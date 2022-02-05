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
import ApplicationPreview from "./ApplicationPreview";
import Container from "@mui/material/Container";
import {useNavigate} from "react-router-dom";

function CompetitionPreview(props) {
    const [competition, setCompetition] = useState()
    const [file, setFile] = useState(new ArrayBuffer(8))
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/competition/${props.id}`, {
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
                setCompetition(response.data)
            });

        fetch(`/api/competition/${props.id}/file`, {
            credentials: "include"
        })
            .then(res => {
                console.log(res)
                if (res.status === 200) {
                    return res.arrayBuffer()
                } else if (res.status === 401) {
                    navigate(`/login`,{replace: true})
                } else {
                    throw res.json()
                }
            })
            .then((response) => {
                console.log(response);
                setFile(response)
            })
    }, [])

    const downloadFile = () => {
        console.log('download file start')
        console.log(file);
        let blob = new Blob([file], {type: "application/pdf"})
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${competition.name}.pdf`;
        link.click();
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: "100%", margin: 2}}>
            <Box>
                <Typography variant={'h5'} textAlign={'center'}>
                    {competition && competition.name}
                </Typography>
                <Typography variant={'h6'} textAlign={'center'}>
                    {competition && competition.dates}
                </Typography>
                <Typography variant={'h6'} textAlign={'center'}>
                    {competition && competition.place}
                </Typography>
            </Box>
            <Box sx={{flex: 1}}>
                <Typography variant={'body1'} textAlign={'left'}>
                    {competition && competition.info}
                </Typography>
            </Box>
            <Box sx={{marginTop: "auto", marginBottom: 1}}>
                <Typography variant={'body1'} textAlign={'left'}>
                    Дата окончания приёма заявок: &nbsp;
                    <b>{competition &&
                        format(parse(Date.parse(competition.deadline), 'T', 0), 'PPPP', {locale: ruLocale})
                    } (
                        {competition &&
                            formatDistance(
                                parse(Date.parse(competition.deadline), 'T', 0),
                                Date.now(),
                                {locale: ruLocale, addSuffix: true}
                            )
                        })</b>
                </Typography>
                <Divider component={'div'} variant={"fullWidth"} orientation={'horizontal'}/>
                <Button
                    size={'large'}
                    sx={{marginTop: 1}}
                    variant={'contained'}
                    endIcon={<InsertDriveFileIcon/>}
                    onClick={downloadFile}
                >
                    Скачать прикрепленный файл
                </Button>
            </Box>
        </Box>
    )

}

export default CompetitionPreview
