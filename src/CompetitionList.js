import React, {useEffect, useState} from "react";
import './App.css';
import {
    useNavigate
} from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import {Divider, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import List from "@mui/material/List";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {format, parse} from "date-fns";
import ruLocale from "date-fns/locale/ru";

function CompetitionList(props) {
    const [list, setList] = useState([])
    let navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/competition/list/${props.type}`, {
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
                response.data.sort((a, b) => a.deadline > b.deadline)
                setList(response.data)
            })
            .catch(async (err) => {
                let error = await err
                props.showAlert("error", error.message)
            })
    },[props.type])

    return (
        <List>
            {list.map(item => {
                return (
                    <React.Fragment>
                        <ListItem id={item.id} button onClick={()=>props.type==='user' ? navigate(`/competition/${item.id}`,{replace: true}) : navigate(`/competition/${item.id}/new`,{replace: true})}>
                            <ListItemIcon>
                                <EmojiEventsIcon sx={{color: Date.parse(item.deadline) > Date.now() ? 'gold.main' : null}}/>
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
                                    <React.Fragment>
                                        <Typography
                                            component="div"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {item.id.slice(0, 12)}
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
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        <Divider variant={"fullWidth"} component="li"/>
                    </React.Fragment>
                )
            })}
        </List>
    );
}


export default CompetitionList;
