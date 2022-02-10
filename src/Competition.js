import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
    Divider,
} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CompetitionPreview from "./CompetitionPreview";
import {useNavigate} from "react-router-dom";

function Competition(props) {
    let navigate = useNavigate();

    const deleteCompetition = () => {
        fetch(`/api/competition/${document.location.href.split('/')[4]}`, {
            method: "DELETE",
            credentials: "include"
        })
            .then(res => {
                console.log(res)
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
    }

    const downloadFile = () => {
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
                <Button
                    size={'large'}
                    variant={'contained'}
                    endIcon={<DeleteForeverIcon/>}
                    onClick={deleteCompetition}
                    color="error"
                >
                    Удалить соревнование
                </Button>
                <Button
                    size={'large'}
                    sx={{marginLeft: 4}}
                    variant={'contained'}
                    endIcon={<DeleteForeverIcon/>}
                    onClick={() => navigate('new',{replace: false})}
                    color="success"
                >
                    Подать заявку
                </Button>
                <Button
                    size={'large'}
                    sx={{marginLeft: 4}}
                    variant={'contained'}
                    endIcon={<DeleteForeverIcon/>}
                    onClick={downloadFile}
                    color="primary"
                >
                    Скачать TEAMS_SETUP
                </Button>
            </Box>
        </Box>
    )

}

export default Competition
