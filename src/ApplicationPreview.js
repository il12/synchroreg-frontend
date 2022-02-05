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
import application from "./Application";
import Container from "@mui/material/Container";

function ApplicationPreview(props) {
    const [techRoutine, setTechRoutine] = React.useState();
    const [freeRoutine, setFreeRoutine] = React.useState();
    const [figures, setFigures] = React.useState();

    const handleFiguresChange = (event) => {
        setFigures(event.target.value);
    };

    const handleFreeRoutineChange = (event) => {
        setFreeRoutine(event.target.value);
    };

    const handleTechRoutineChange = (event) => {
        setTechRoutine(event.target.value);
    };

    const shouldRenderError = props.application.teamName ? false : 'Что-то пошло не так. Удалите заявку и создайте её заново'

    console.log(props.application.teamName, shouldRenderError)
    return (
        shouldRenderError || <Container>
            <Typography variant={"h5"} textAlign={"center"}>
                {props.application && props.application?.teamName}
            </Typography>
            <Grid container spacing={1}>
                <Grid item xs={4} justifyContent={"center"}>
                    <FormControl variant={'filled'} sx={{m: 1}} fullWidth>
                        <InputLabel id="demo-simple-select-autowidth-label">Фигуры</InputLabel>
                        <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            value={figures}
                            onChange={handleFiguresChange}
                            autoWidth
                            label="Age"
                        >
                            <MenuItem value="joungling">{'<13'}</MenuItem>
                            <MenuItem value="padawan">13-15</MenuItem>
                            <MenuItem value="junior">Юниоры</MenuItem>
                            <MenuItem value="senior">Взрослые</MenuItem>
                        </Select>
                    </FormControl>
                    <ul>
                        {props.application && figures && props.application?.figures[figures]?.map((item) => {
                            return <li>
                                {item.name}
                            </li>
                        })}
                    </ul>
                </Grid>
                <Grid item xs={4} justifyContent={"center"}>
                    <FormControl variant={'filled'} sx={{m: 1}} fullWidth>
                        <InputLabel id="demo-simple-select-autowidth-label">Произвольная
                            программа</InputLabel>
                        <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            value={freeRoutine}
                            onChange={handleFreeRoutineChange}
                            autoWidth
                            label="Age"
                        >
                            <MenuItem value="solo">Соло</MenuItem>
                            <MenuItem value="duet">Дуэт</MenuItem>
                            <MenuItem value="mixed">Дуэт см.</MenuItem>
                            <MenuItem value="team">Группа</MenuItem>
                            <MenuItem value="highlight">Акр. группа</MenuItem>
                            <MenuItem value="combi">Комби</MenuItem>
                        </Select>
                    </FormControl>
                    <ul>
                        {props.application && freeRoutine != 'solo' &&
                            props.application?.free[freeRoutine]?.map((item) => {
                                return <li>
                                    <ul>
                                        {item.athletes.map((athlete) => {
                                            return <li>{athlete.name} {athlete.isReserve ? "(Р)" : null}</li>
                                        })}
                                    </ul>
                                </li>
                            })}
                        {props.application && freeRoutine == 'solo' &&
                            props.application?.free[freeRoutine]?.map((item) => {
                                return <li>{item.athlete.name}</li>
                            })}
                    </ul>
                </Grid>
                <Grid item xs={4}>
                    <FormControl variant={'filled'} sx={{m: 1}} fullWidth>
                        <InputLabel id="demo-simple-select-autowidth-label">Техническая
                            программа</InputLabel>
                        <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            value={techRoutine}
                            onChange={handleTechRoutineChange}
                            autoWidth
                            label="Age"
                        >
                            <MenuItem value="solo">Соло</MenuItem>
                            <MenuItem value="duet">Дуэт</MenuItem>
                            <MenuItem value="mixed">Дуэт см.</MenuItem>
                            <MenuItem value="team">Группа</MenuItem>
                        </Select>
                    </FormControl>
                    <ul>
                        {props.application && techRoutine != 'solo' && props.application?.tech[techRoutine]?.map((item) => {
                            return <li>
                                <ul>
                                    {item.athletes.map((athlete) => {
                                        return <li>{athlete.name} {athlete.isReserve ? "(Р)" : null}</li>
                                    })}
                                </ul>
                            </li>
                        })}
                        {props.application && techRoutine == 'solo' &&
                            props.application?.tech[techRoutine]?.map((item) => {
                                return <li>{item.athlete.name}</li>
                            })}
                    </ul>
                </Grid>
            </Grid>
        </Container>
    )

}

export default ApplicationPreview
