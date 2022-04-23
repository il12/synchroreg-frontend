import React, {useState} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Divider, FormLabel, Input, TextField} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import SendIcon from '@mui/icons-material/Send';
import ruLocale from 'date-fns/locale/ru';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {useNavigate} from "react-router-dom";

function Competition(props) {
    const [selectedFile, setSelectedFile] = useState();
    const [competition, setCompetition] = useState({
        name: '',
        dates: '',
        place: '',
        info: '',
        deadline: '',
    })
    const navigate = useNavigate();
    const changeFileHandler = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleCompetitionChange = (event) => {
        setCompetition((state) => {
            let newState = Object.assign({}, state);
            newState[event.target.id || event.target.name] = event.target.value;
            return newState;
        })
    }
    const submitData = () => {
        const formData = new FormData();
        formData.append('name', competition.name)
        formData.append('dates', competition.dates)
        formData.append('place', competition.place)
        formData.append('info', competition.info)
        formData.append('deadline', competition.deadline)
        formData.append('file', selectedFile);
        fetch('/api/competition/create', {
            method: "POST",
            credentials: "include",
            body: formData
        })
            .then(res => {
                if (res.status === 200) {
                    props.showAlert('success', 'Соревнование успешно создано')
                    navigate(`/competition/my`,{replace: true})
                } else if (res.status === 401) {
                    navigate(`/login`,{replace: true})
                } else {
                    throw res.json()
                }
            })
            .catch(async (err) => {
                let error = await err
                props.showAlert("error", error.message)
            })
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Typography variant={'h5'} textAlign={'center'}>
                Новое соревнование
            </Typography>
            <TextField
                margin={"dense"}
                fullWidth
                id="name"
                label="Название соревнования"
                onChange={handleCompetitionChange}
            />
            <TextField
                margin={"dense"}
                fullWidth
                id="dates"
                label="Даты проведения"
                onChange={handleCompetitionChange}
            />
            <TextField
                margin={"dense"}
                fullWidth
                id="place"
                label="Место проведения"
                onChange={handleCompetitionChange}
            />
            <TextField
                margin={"dense"}
                fullWidth
                id="info"
                label="Доп. информация"
                multiline
                rows={7}
                onChange={handleCompetitionChange}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                <DatePicker
                    id={"deadline"}
                    label={"Дата окончания приёма заявок"}
                    mask={'__.__.____'}
                    value={competition.deadline}
                    onChange={(newValue) => {
                        setCompetition((state) => {
                            let newState = Object.assign({}, state);
                            newState.deadline = newValue;
                            return newState;
                        })
                    }}
                    renderInput={(params) => <TextField margin={"dense"} type={"date"} fullWidth {...params}
                                                        placeholder={'dd.mm.yyyy'}/>}
                />
            </LocalizationProvider>
            <FormControl sx={{marginTop: 2}} variant={'filled'} fullWidth>
                <FormLabel id="file-label">При необходимости добавьте файлы .pdf, которые будут отображаться в
                    описании соревнования</FormLabel>
                <Input
                    variant={'outlined'}
                    fullWidth
                    labelId="file-label"
                    id="file"
                    inputProps={{
                        accept: '.pdf',
                        multiple: false
                    }}
                    type={'file'}
                    onChange={changeFileHandler}
                />
            </FormControl>
            <Divider variant={'fullWidth'} orientation={'horizontal'}/>
            <Button
                size={'large'}
                sx={{marginTop: 'auto', marginBottom: 1}}
                variant={'contained'}
                endIcon={<SendIcon/>}
                onClick={submitData}
            >
                Создать соревнование
            </Button>
        </Box>
    )

}

export default Competition
