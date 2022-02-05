import React, {useEffect, useState} from "react";
import './App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useMatch, useNavigate
} from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid";
import {Divider, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import List from "@mui/material/List";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {format, parse} from "date-fns";
import ruLocale from "date-fns/locale/ru";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

function ApplicationList(props) {
    const [list, setList] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/application/list/user`, {
            credentials: "include"
        })
            .then(res => {
                if (res.status === 200) {
                    return res.json()
                } else if (res.status === 401) {
                    navigate(`/login`,{replace: true})
                } else {
                    throw res.json()
                }
            })
            .then((response) => {
                console.log(response)
                response.data.sort((a, b) => a.deadline > b.deadline)
                setList(response.data)
            })
    }, [])

    return (
        <List>
            {list.map(item => {
                return (
                    <React.Fragment>
                        <ListItem key={item.rowid} button onClick={()=>navigate(`/application/${item.rowid}`, {replace: true})}>
                            <ListItemIcon>
                                <AppRegistrationIcon sx={{color: Date.parse(item.deadline) > Date.now() ? 'gold.main' : null}}/>
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography
                                        component="div"
                                        variant="body1"
                                        color="text.primary"
                                        sx={{fontWeight: 'bold'}}
                                    >
                                        {item.name}
                                    </Typography>
                                }
                                secondary={
                                    <Typography component={'div'}>
                                        <Typography
                                            component="div"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {item.rowid}
                                        </Typography>
                                        <Box component={'div'} sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}
                                        >
                                            <Typography
                                                component="div"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {item.dates} &bull; <em>{item.place}</em>
                                            </Typography>

                                            <Typography
                                                component="div"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {
                                                    format(parse(Date.parse(item.deadline), 'T', 0),'PP',{locale: ruLocale})
                                                }
                                            </Typography>
                                        </Box>
                                    </Typography>
                                }
                            />
                        </ListItem>
                        <Divider key={item.rowid+'divider'} variant={"fullWidth"} component="li"/>
                    </React.Fragment>
                )
            })}
        </List>
    );
}


export default ApplicationList;
