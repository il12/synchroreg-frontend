import React, {useState} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
    Divider,
} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import CompetitionPreview from "./CompetitionPreview";
import {useNavigate} from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";

function Competition(props) {
    let navigate = useNavigate();
    let [teamSetupButton, setTeamSetupButton] = useState(false);
    let [deleteCompetitionButton, setDeleteCompetitionButton] = useState(false);

    const deleteCompetition = () => {
        setDeleteCompetitionButton(true);
        fetch(`/api/competition/${document.location.href.split('/')[4]}`, {
            method: "DELETE",
            credentials: "include"
        })
            .then(res => {
                if (res.status === 200) {
                    props.showAlert('success', 'Соревнование успешно удалено')
                    navigate('/application/my',{replace: true});
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
            .finally(()=>{
                setDeleteCompetitionButton(false)
            })
    }

    const downloadFile = () => {
        setTeamSetupButton(true);
        props.showAlert('info','Файл TEAMS_SETUP.xlsx генерируется...')
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
                let blob = new Blob([response], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `TEAMS_SETUP.xlsx`;
                link.click();
            })
            .catch(async (err) => {
                let error = await err
                props.showAlert("error", error.message)
            })
            .finally(()=>{
                setTeamSetupButton(false)
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
                <LoadingButton
                    loading={deleteCompetitionButton}
                    size={'large'}
                    variant={'contained'}
                    endIcon={<DeleteForeverIcon/>}
                    onClick={deleteCompetition}
                    color="error"
                >
                    Удалить соревнование
                </LoadingButton>
                <Button
                    size={'large'}
                    sx={{marginLeft: 4}}
                    variant={'contained'}
                    endIcon={<AddIcon/>}
                    onClick={() => navigate('new',{replace: false})}
                    color="success"
                >
                    Подать заявку
                </Button>
                <LoadingButton
                    loading={teamSetupButton}
                    size={'large'}
                    sx={{marginLeft: 4}}
                    variant={'contained'}
                    endIcon={<DownloadIcon/>}
                    onClick={downloadFile}
                    color="primary"
                >
                    Скачать TEAMS_SETUP
                </LoadingButton>
            </Box>
        </Box>
    )

}

export default Competition
