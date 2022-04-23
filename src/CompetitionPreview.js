import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
    Divider,
} from "@mui/material";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ruLocale from 'date-fns/locale/ru';
import {formatDistance, parse, format} from 'date-fns'
import {useNavigate} from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import CompetitionStatistic from "./CompetitionStatistic";

function CompetitionPreview(props) {
    const [competition, setCompetition] = useState()
    const [statistic, setStatistic] = useState()
    const [downloadFileButton, setDownloadFileButton] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/competition/${props.id}`, {
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
            });

        fetch(`/api/competition/${props.id}/statistic`, {
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
                processStatistic(response)
            })
            .catch(async (err) => {
                let error = await err
                props.showAlert("error", error.message)
            });

    }, [])

    const processStatistic = (applications) => {
        console.log(applications);
        const teams = applications.map((application) => {
            return application.teamName;
        })
        const athletesCount = applications.reduce((accumulator, application) => {
            return accumulator += application.athletes.length;
        }, 0)
        const staffCount = applications.reduce((accumulator, application) => {
            return accumulator += application.staff.length;
        }, 0)
        const routinesCount = applications.reduce((accumulator, application) => {
            for (const routine in application.free) {
                accumulator.free[routine] += application.free[routine].length;
            }
            for (const routine in application.tech) {
                accumulator.tech[routine] += application.tech[routine].length;
            }
            return accumulator;
        }, {
            free: {
                solo: 0,
                duet: 0,
                mixed: 0,
                team: 0,
                highlight: 0,
                combi: 0
            },
            tech: {
                solo: 0,
                duet: 0,
                mixed: 0,
                team: 0,
            }
        })
        console.log({
            teams: teams,
            athletesCount: athletesCount,
            staffCount: staffCount,
            routinesCount: routinesCount,
        });
        setStatistic({
            teams: teams,
            athletesCount: athletesCount,
            staffCount: staffCount,
            routinesCount: routinesCount,
        })
    }

    const downloadFile = () => {
        setDownloadFileButton(true)
        fetch(`/api/competition/${props.id}/file`, {
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
                let blob = new Blob([response], {type: "application/pdf"})
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `${competition.name}.pdf`;
                link.click();
            })
            .catch(async (err) => {
                let error = await err
                props.showAlert("error", error.message)
            })
            .finally(() => {
                setDownloadFileButton(false)
            })
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
                {statistic && <CompetitionStatistic data={statistic}/>}
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
                <LoadingButton
                    loading={downloadFileButton}
                    size={'large'}
                    sx={{marginTop: 1}}
                    variant={'contained'}
                    endIcon={<InsertDriveFileIcon/>}
                    onClick={downloadFile}
                >
                    Скачать прикрепленный файл
                </LoadingButton>
            </Box>
        </Box>
    )

}

export default CompetitionPreview
