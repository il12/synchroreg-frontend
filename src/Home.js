import React, {useState} from "react";
import './App.css';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";

import HomeIcon from "@mui/icons-material/Home"
import ListIcon from "@mui/icons-material/List"
import AddIcon from "@mui/icons-material/Add"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Content from "./ApplicationForCompetition";
import {Outlet, useNavigate} from "react-router-dom";
import {Box, Collapse, Divider, IconButton} from "@mui/material";
import Grid from "@mui/material/Grid";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import MenuIcon from '@mui/icons-material/Menu';

function Home(props) {
    let navigate = useNavigate();
    const [open, setOpen] = useState()

    const handleDrawerOpen = () => {
        setOpen(!open);
    }

    return (
        <Box sx={{
            height: '100vh',
            width: '100vw',
            display: "flex"
        }}>
            <CssBaseline/>
            <AppBar position="fixed" sx={{
                zIndex: theme => theme.zIndex.drawer + 1,
            }}>
                <Toolbar disableGutters sx={{padding: 1}}>
                    <Box sx={{
                        width: open ? "15vw" : '60px',
                        transition: (theme) => theme.transitions.create('width', {
                            easing: theme.transitions.easing.easeOut,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    }}>
                        <IconButton
                            onClick={handleDrawerOpen}
                        >
                            <MenuIcon sx={{color: 'white.main'}}/>
                        </IconButton>
                    </Box>
                    <Typography variant="h6">
                        Система регистрации на соревнования по синхронному плаванию
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                open={open}
                variant="permanent"
                sx={{
                    width: open ? "15vw" : '60px',
                    transition: (theme) => theme.transitions.create('width', {
                        easing: theme.transitions.easing.easeOut,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    flexShrink: 0,
                    overflowX: 'hidden',
                    [`& .MuiDrawer-paper`]: {width: open ? "15vw" : '60px', boxSizing: 'border-box'},
                }}
            >
                <List sx={{overflowX: 'hidden'}}>
                    <Toolbar/>
                    <ListItem button key={"Create"} onClick={() => navigate('/competition/new',{replace: true})}>
                        <ListItemIcon>
                            <AddIcon/>
                        </ListItemIcon>
                        <Collapse in={open} orientation={'horizontal'}>
                            <ListItemText primary={"Создать соревнование"}/>
                        </Collapse>
                    </ListItem>
                    <ListItem button key={"Active"} onClick={() => navigate('/competition',{replace: true})}>
                        <ListItemIcon>
                            <EmojiEventsIcon  sx={{color: 'gold.main'}}/>
                        </ListItemIcon>
                        <Collapse in={open} orientation={'horizontal'}>
                            <ListItemText primary={"Активные соревнования"}/>
                        </Collapse>
                    </ListItem>
                    <ListItem button key={"Past"} onClick={() => navigate('/competition/past',{replace: true})}>
                        <ListItemIcon>
                            <EmojiEventsIcon/>
                        </ListItemIcon>
                        <Collapse in={open} orientation={'horizontal'}>
                            <ListItemText primary={"Прошедшие соревнования"}/>
                        </Collapse>
                    </ListItem>
                    <ListItem button key={"CompMy"} onClick={() => navigate('/competition/my',{replace: true})}>
                        <ListItemIcon>
                            <ListIcon/>
                        </ListItemIcon>
                        <Collapse in={open} orientation={'horizontal'}>
                            <ListItemText primary={"Мои соревнования"}/>
                        </Collapse>
                    </ListItem>
                    <ListItem button key={"AppMy"} onClick={() => navigate('/application/my',{replace: true})}>
                        <ListItemIcon>
                            <AppRegistrationIcon/>
                        </ListItemIcon>
                        <Collapse in={open} orientation={'horizontal'}>
                            <ListItemText primary={"Мои заявки"}/>
                        </Collapse>
                    </ListItem>
                </List>
            </Drawer>
            <Box
                display="flex"
                flex={1}
                flexDirection={{xs: "column"}}
                sx={{margin: 1}}
            >
                <Toolbar/>
                <Box component="main"
                     display="flex"
                     flex={1}
                     flexDirection={{sm: "row"}}
                >
                    <Box flex={{xs: 12, sm: 9}}>
                        <Outlet/>
                    </Box>
                    <Divider/>
                    <Box flex={{xs: 12, sm: 2}} sx={{display: "flex", flexDirection: "column"}}>
                        <List>
                            <ListItem key={'forsale'}>
                                <ListItemText primary={"Блок рекламы"}/>
                            </ListItem>
                        </List>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
        ;
}


export default Home;
