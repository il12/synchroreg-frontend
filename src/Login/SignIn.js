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
import Paper from '@mui/material/Paper'

export default function SignIn(props) {
    const [user, setUser] = useState({
        login: "",
        password: ""
    })

    const handleChange = (e)=>{
        setUser((state) => {
            let newState = Object.assign({}, state);
            newState[e.target.id || e.target.name] = e.target.value;
            return newState;
        })
    }

    const sendData = (e) => {
        fetch('/api/auth/login', {
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
            .then(response => {
                document.location.href = '/'
            })
            .catch(async (err)=>{
                let error = await err
                props.showAlert("error",error.message)
            })
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
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
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="login"
                    label="Login"
                    name="login"
                    autoComplete="login"
                    autoFocus
                    onChange={handleChange}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={handleChange}
                />
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary"/>}
                    label="Remember me"
                />
                <Button
                    onClick={sendData}
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{
                        margin: [3, 0, 2]
                    }}
                >
                    Sign In
                </Button>
                <Grid container>
                    <Grid item>
                        <Link href="/signup" variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}
