import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
    FormLabel,
    Input,
    Step,
    StepContent,
    StepLabel,
    Stepper
} from "@mui/material";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import AddTaskIcon from '@mui/icons-material/AddTask';
import ApplicationPreview from "./ApplicationPreview";
import CompetitionPreview from "./CompetitionPreview";
import {useNavigate} from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";

function ApplicationForCompetition(props) {
    const [tab, setTab] = React.useState('1');
    const [competition, setCompetition] = useState()
    const [application, setApplication] = useState(false)
    const [activeStep, setActiveStep] = React.useState(0);
    const [applicationFile, setApplicationFile] = useState();
    const [downloadApplicationTemplateButton, setDownloadApplicationTemplateButton] = useState(false)
    const [saveApplicationButton, setSaveApplicationButton] = useState(false)
    const [isApplicationCorrect, setIsApplicationCorrect] = useState(false);
    const navigate = useNavigate();

    const changeFileHandler = (event) => {
        if (event.target.files[0].type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            setApplicationFile(event.target.files[0]);
        } else {
            props.showAlert('error', 'Пожалуйста, загружайте исключительно ".xlsx" файлы.');
            event.target.value = null;
        }
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
        setApplicationFile(null);
    };

    useEffect(() => {
        fetch(`/api/competition/${document.location.href.split('/')[4]}`, {
            credentials: "include"
        })
            .then(res => {
                if (res.status === 200) {
                    return res.json()
                } else if (res.status === 401) {
                    navigate(`/login`, {replace: true})
                } else {
                    throw res.json()
                }
            })
            .then((response) => {
                setCompetition(response.data)
            })
            .catch(async (err) => {
                let error = await err
                props.showAlert("error", error.message)
            })
    }, [])

    const parseApplicationFile = () => {
        console.log(applicationFile);
        const formData = new FormData();
        formData.append('file', applicationFile);
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
                    navigate(`/login`, {replace: true})
                } else {
                    throw res.json();
                }
            })
            .then((response) => {
                setApplication(response)
                setIsApplicationCorrect(true);
            })
            .catch(async (err) => {
                let error = await err
                props.showAlert("error", error.message)
            })
    }

    const sendApplication = () => {
        setSaveApplicationButton(true)
        const formData = new FormData();
        formData.append('application', JSON.stringify(application));
        formData.append('competition', document.location.href.split('/')[4])
        formData.append('file', applicationFile);
        fetch(`/api/application/save`, {
            method: "POST",
            credentials: "include",
            body: formData
        })
            .then(res => {
                if (res.status === 200) {
                    props.showAlert('success', 'Заявка успешно подана')
                } else if (res.status === 401) {
                    navigate(`/login`, {replace: true})
                } else {
                    throw res.json();
                }
            })
            .catch(async (err) => {
                let error = await err
                props.showAlert("error", error.message)
            })
            .finally(() => {
                setSaveApplicationButton(false);
            })
    }

    const downloadApplicationTemplateFile = () => {
        setDownloadApplicationTemplateButton(true);
        fetch(`/api/application/template/get/${document.location.href.split('/')[4]}`, {
            credentials: "include"
        })
            .then(res => {
                if (res.status === 200) {
                    return res.arrayBuffer()
                } else if (res.status === 401) {
                    navigate(`/login`, {replace: true})
                } else {
                    throw res.json()
                }
            })
            .then((response) => {
                let blob = new Blob([response], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `Заявка_${competition.name}.xlsx`;
                link.click();
            })
            .catch(async (err) => {
                let error = await err
                props.showAlert("error", error.message)
            })
            .finally(() => {
                setDownloadApplicationTemplateButton(false)
            })
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
                        <Tab label="Инфо" value="1"/>
                        <Tab label="Подать заявку" value="2"/>
                        <Tab label="Предпросмотр" value="3" disabled={!application}/>
                    </TabList>
                </Box>
                <TabPanel value="1" sx={{flex: 1}}>
                    <CompetitionPreview id={document.location.href.split('/')[4]} showAlert={props.showAlert}/>
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
                                    <LoadingButton
                                        loading={downloadApplicationTemplateButton}
                                        size={'large'}
                                        sx={{marginTop: 4}}
                                        variant={'contained'}
                                        endIcon={<InsertDriveFileIcon/>}
                                        onClick={downloadApplicationTemplateFile}
                                    >
                                        Скачать файл заявки
                                    </LoadingButton>
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
                                    <div style={{padding: '5px', border: '2px solid red'}}>
                                        <Typography>
                                            Комментарий от разработчика
                                        </Typography>
                                        <Typography>
                                            <p>Пожалуйста, сохраняйте структуру документа. Не удаляйте и не добавляйте строки/столбцы.<br/>
                                            Заполняйте все поля, которые есть в документе.<br/>
                                            Не меняйте расширение файла!<br/>
                                            В случае проблем в документе, система выдаст подсказку в левом нижнем углу.</p>
                                        </Typography>
                                    </div>
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
                                <Typography>Проверьте и подтвердите заявку на вкладке Предпросмотр. После этого вы не
                                    сможете
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
                         sx={{height: '100%'}}
                    >
                        <ApplicationPreview application={application}/>
                        <LoadingButton
                            loading={saveApplicationButton}
                            size={'large'}
                            sx={{marginTop: "auto", marginBottom: 1}}
                            variant={'contained'}
                            endIcon={<AddTaskIcon/>}
                            onClick={sendApplication}
                            color="success"
                        >
                            Подтвердить подачу заявки
                        </LoadingButton>
                    </Box>
                </TabPanel>
            </TabContext>
        </Box>
    )

}

export default ApplicationForCompetition
