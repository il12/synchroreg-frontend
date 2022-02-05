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
import CompetitionPreview from "./CompetitionPreview";
import {useNavigate} from "react-router-dom";

function ApplicationForCompetition(props) {
    const [tab, setTab] = React.useState('1');
    const [competition, setCompetition] = useState()
    const [file, setFile] = useState(new ArrayBuffer(8))
    const [appFile, setAppFile] = useState(new ArrayBuffer(8))
    const [application, setApplication] = useState(false)
    const [activeStep, setActiveStep] = React.useState(0);
    const [selectedFile, setSelectedFile] = useState();
    const navigate = useNavigate();

    const changeFileHandler = (event) => {
        console.log(event.target);
        setSelectedFile(event.target.files[0]);
    };

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    const handleNextStep = () => {
        setActiveStep((prevActiveStep) => {
            const newActiveStep = prevActiveStep + 1;
            if (newActiveStep === 3) {
                parseApplicationFile();
            }
            return newActiveStep;
        });
    };

    const handleBackStep = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleResetSteps = () => {
        setActiveStep(0);
        setSelectedFile(null);
    };

    useEffect(() => {
        fetch(`/api/competition/${document.location.href.split('/')[4]}`, {
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

        fetch(`/api/competition/${document.location.href.split('/')[4]}/file`, {
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

        fetch(`/api/application/template/get/${document.location.href.split('/')[4]}`, {
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
                setAppFile(response)
            })
    }, [])

    const parseApplicationFile = () => {
        console.log("parsing");
        const formData = new FormData();
        formData.append('application', selectedFile);
        console.log(formData.get('application'));
        fetch(`/api/application/parse`, {
            method: "POST",
            credentials: "include",
            body: formData
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
                console.log(response);
                setApplication(response)
            });
    }

    const sendApplication = () => {
        const formData = new FormData();
        formData.append('application', JSON.stringify(application));
        formData.append('competition', document.location.href.split('/')[4])
        formData.append('file', selectedFile);
        fetch(`/api/application/save`, {
            method: "POST",
            credentials: "include",
            body: formData
        })
            .then(res => {
                console.log(res)
                if (res.status === 200) {
                    props.showAlert('success', 'Заявка успешно подана')
                } else if (res.status === 401) {
                    navigate(`/login`,{replace: true})
                } else {
                    props.showAlert('error', 'При подаче заявки произошла ошибка, обратитесь к администратору')
                }
            })
    }


    const downloadFile = () => {
        console.log('download file start')
        console.log(file);
        let blob = new Blob([file], {type: "application/pdf"})
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${competition.name}.pdf`;
        link.click();
    }
    const downloadApplicationFile = () => {
        console.log('download file start')
        console.log(appFile);
        let blob = new Blob([appFile], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `Заявка_${competition.name}.xlsx`;
        link.click();
    }

    return (
        <Box display="flex"
             flex={1}
             flexDirection='column'
             sx={{height: '100%'}}
        >
            <TabContext value={tab}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <TabList variant="fullWidth" onChange={handleTabChange} aria-label="Tabs labels">
                        <Tab label="Info" value="1"/>
                        <Tab label="Application" value="2"/>
                        <Tab label="Preview" value="3" disabled={!application}/>
                    </TabList>
                </Box>
                <TabPanel value="1" sx={{flex: 1}}>
                    <CompetitionPreview id={document.location.href.split('/')[4]}/>
                </TabPanel>
                <TabPanel value="2" sx={{height: "100%"}}>
                    <Box sx={{height: '100%'}}>
                        <Stepper activeStep={activeStep} orientation='vertical' sx={{flexGrow: 1}}>
                            <Step key={'firstStep'}>
                                <StepLabel>
                                    Шаг 1
                                </StepLabel>
                                <StepContent>
                                    <Typography>
                                        Скачайте файл заявки, нажав на кнопку ниже.
                                    </Typography>
                                    <Button
                                        size={'large'}
                                        sx={{marginTop: 4}}
                                        variant={'contained'}
                                        endIcon={<InsertDriveFileIcon/>}
                                        onClick={downloadApplicationFile}
                                    >
                                        Скачать файл заявки
                                    </Button>
                                    <Box sx={{mb: 2}}>
                                        <div>
                                            <Button
                                                variant="contained"
                                                onClick={handleNextStep}
                                                sx={{mt: 1, mr: 1}}
                                            >
                                                Вперёд
                                            </Button>
                                            <Button
                                                disabled
                                                onClick={handleBackStep}
                                                sx={{mt: 1, mr: 1}}
                                            >
                                                Назад
                                            </Button>
                                        </div>
                                    </Box>
                                </StepContent>
                            </Step>
                            <Step key={'secondStep'}>
                                <StepLabel>
                                    Шаг 2
                                </StepLabel>
                                <StepContent>
                                    <Typography>
                                        Заполните загруженный файл заявки.
                                    </Typography>
                                    <Box sx={{mb: 2}}>
                                        <div>
                                            <Button
                                                variant="contained"
                                                onClick={handleNextStep}
                                                sx={{mt: 1, mr: 1}}
                                            >
                                                Вперёд
                                            </Button>
                                            <Button
                                                onClick={handleBackStep}
                                                sx={{mt: 1, mr: 1}}
                                            >
                                                Назад
                                            </Button>
                                        </div>
                                    </Box>
                                </StepContent>
                            </Step>
                            <Step key={'thirdStep'}>
                                <StepLabel>
                                    Шаг 3
                                </StepLabel>
                                <StepContent>
                                    <FormControl sx={{marginTop: 4}} variant={'filled'}>
                                        <FormLabel id="file-label">Загрузите заполненный файл заявки</FormLabel>
                                        <Input
                                            variant={'outlined'}
                                            id="file"
                                            inputProps={{
                                                accept: '.xlsx',
                                                multiple: false
                                            }}
                                            type={'file'}
                                            onChange={changeFileHandler}
                                        />
                                    </FormControl>
                                    <Box sx={{mb: 2}}>
                                        <div>
                                            <Button
                                                variant="contained"
                                                onClick={handleNextStep}
                                                sx={{mt: 1, mr: 1}}
                                            >
                                                Подтвердить загрузку файла
                                            </Button>
                                            <Button
                                                onClick={handleBackStep}
                                                sx={{mt: 1, mr: 1}}
                                            >
                                                Назад
                                            </Button>
                                        </div>
                                    </Box>
                                </StepContent>
                            </Step>
                        </Stepper>
                        {activeStep === 3 && (
                            <Paper square elevation={0} sx={{p: 3}}>
                                <Typography>Проверьте и подтвердите заявку на вкладке Preview. После этого вы не сможете
                                    изменить свою заявку.</Typography>
                                <Button onClick={handleResetSteps} sx={{mt: 1, mr: 1}}>
                                    Сброс
                                </Button>
                            </Paper>
                        )}
                    </Box>
                </TabPanel>
                <TabPanel value="3" sx={{height: "100%"}}>
                    <Box display="flex"
                         flex={1}
                         flexDirection='column'
                         sx={{border: 'solid green', height: '100%'}}
                    >
                        <ApplicationPreview application={application}/>
                        <Button
                            size={'large'}
                            sx={{marginTop: "auto", marginBottom: 1}}
                            variant={'contained'}
                            endIcon={<AddTaskIcon/>}
                            onClick={sendApplication}
                            disabled={!selectedFile}
                            color="success"
                        >
                            Подтвердить подачу заявки
                        </Button>
                    </Box>
                </TabPanel>
            </TabContext>
        </Box>
    )

}

export default ApplicationForCompetition
