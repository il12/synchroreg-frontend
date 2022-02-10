import React, {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from "@mui/material/Paper";
import {useNavigate} from "react-router-dom";

export default function SignUp(props) {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        login: "",
        password: "",
        email: '',
        fullname: "",
    })

    const handleChange = (e)=>{
        setUser((state) => {
            let newState = Object.assign({}, state);
            newState[e.target.id || e.target.name] = e.target.value;
            return newState;
        })
    }

    const sendData = () => {
        fetch('/api/auth/signup', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(user),
        })
            .then((res) => {
                if(res.status === 200){
                    return res.json()
                } else {
                    throw res.json()
                }
            })
            .then(() => {
                navigate('/',{replace: true})
            })
            .catch(async (err)=>{
                let error = await err
                props.showAlert("error",error.message)
            })
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Paper sx={{
                marginTop: 8,
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Avatar sx={{
                    margin: 1,
                    backgroundColor: 'secondary.main',
                }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="login"
                                name="login"
                                variant="outlined"
                                required
                                fullWidth
                                id="login"
                                label="Login"
                                onChange={handleChange}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="name"
                                label="Full Name"
                                name="name"
                                autoComplete="name"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox value="allowExtraEmails" color="primary" />}
                                label="I want to receive inspiration, marketing promotions and updates via email."
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={sendData}
                            >
                                Sign Up
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Link href="/login" variant="body2" >
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}
