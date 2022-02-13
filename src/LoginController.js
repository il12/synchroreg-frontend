import {getCookie, deleteCookie} from "./helpers";
import {Box} from "@mui/material";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

function LoginController() {
    const [user, setUser] = useState(getCookie('userid'));
    const navigate = useNavigate();
    const logout = () => {
        fetch('/api/auth/logout')
            .then(() => {
                deleteCookie('userid');
                setUser(getCookie('userid'));
                navigate('/', {replace: true})
            })
    }

    if (user) {
        return <Button
            color={'error'}
            variant="contained"
            onClick={logout}
            sx={{
                marginRight: 3,
            }}
            endIcon={<LogoutIcon/>}
        >
            {user}
        </Button>
    } else {
        return <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            mr: 3,
        }}>
            <Button
                color={'success'}
                variant="contained"
                onClick={() => navigate('/login', {replace: true})}
                sx={{mr: 2}}
                endIcon={<LoginIcon/>}
            >
                Войти
            </Button>
            <Button
                color={'info'}
                variant="contained"
                onClick={() => navigate('/signup', {replace: true})}
            >
                Регистрация
            </Button>
        </Box>
    }
}

export default LoginController
