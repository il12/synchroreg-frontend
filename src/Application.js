import React, {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ApplicationPreview from "./ApplicationPreview";
import Container from "@mui/material/Container";
import {useNavigate} from "react-router-dom";

function Application(props) {
    const [application, setApplication] = useState(false)
    const [competition, setCompetition] = useState(false)
    const [deleteButtonLoading, setDeleteButtonLoading] = useState(false);
    const navigate = useNavigate();

    const deleteApplication = () => {
        setDeleteButtonLoading(true);
        fetch(`/api/application/${document.location.href.split('/')[4]}`, {
            method: "DELETE",
            credentials: "include"
        })
            .then(res => {
                if (res.status === 200) {
                    props.showAlert('success', 'Заявка успешно удалена')
                    navigate(`/application/my`, {replace: true})
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
            .finally(()=>{
                setDeleteButtonLoading(false);
            })
    }


    useEffect(() => {
        fetch(`/api/application/${document.location.href.split('/')[4]}`, {
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
                setApplication(JSON.parse(response.data.json))
                setCompetition(response.data);
            })
            .catch(async (err) => {
                let error = await err
                props.showAlert("error", error.message)
            })
    }, [])

    return (
        <Container sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Typography component={"h3"} variant={"h5"} textAlign={"center"}>
                {competition?.name}
            </Typography>
            <ApplicationPreview sx={{flex: 1}} application={application}/>
            <LoadingButton
                loading={deleteButtonLoading}
                size={'large'}
                sx={{marginTop: "auto", marginBottom: theme => theme.spacing(1)}}
                variant={'contained'}
                endIcon={<DeleteForeverIcon/>}
                onClick={deleteApplication}
                color="error"
            >
                Удалить заявку
            </LoadingButton>
        </Container>
    )

}

export default Application
