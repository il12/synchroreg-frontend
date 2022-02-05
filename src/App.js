import './App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";
import SignIn from "./Login/SignIn";
import SignUp from "./Login/SignUp";
import React, {useState} from "react";
import Snackbar from "@mui/material/Snackbar";
import {createTheme, ThemeProvider} from "@mui/material";
import Home from "./Home";
import ApplicationForCompetition from "./ApplicationForCompetition";
import CreateCompetition from "./CreateCompetition";
import Alert from '@mui/material/Alert';
import CompetitionList from "./CompetitionList";
import ApplicationList from "./ApplicationList";
import Application from "./Application";
import Competition from "./Competition";


function App() {

    const theme= createTheme({
        palette: {
            gold: {
                light: "#F9F295",
                main: "#ECAA3E"
            },
            white: {
                main: "#FFFFFF"
            }
        }
    });

    const [notificationState,setNotificationState] = useState({
        type: "error",
        text: "Непредвиденная ошибка, обратитесь к разработчику"
    })
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setIsSnackbarOpen(false);
    };

    const showAlert = (type,text) => {
        setNotificationState({
            type: type,
            text: text
        })
        setIsSnackbarOpen(true);
    }

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Routes>
                    <Route path="/login" element={<SignIn showAlert={showAlert}/>} />
                    <Route path="/signup" element={<SignUp showAlert={showAlert} />} />
                    <Route path="/" element={<Home showAlert={showAlert} />}>
                        <Route path={'competition'}>
                            <Route
                                path={'new'}
                                element={<CreateCompetition showAlert={showAlert} />}
                            />
                            <Route
                                path={'past'}
                                element={<CompetitionList type='past' showAlert={showAlert}/>}
                            />
                            <Route
                                path={'my'}
                                element={<CompetitionList type='user' showAlert={showAlert}/>}
                            />
                            <Route path={':id'}>
                                <Route
                                    index
                                    element={<Competition showAlert={showAlert}/>}
                                />
                                <Route
                                    path={'new'}
                                    element={<ApplicationForCompetition showAlert={showAlert}/>}
                                />
                            </Route>
                            <Route
                                index
                                element={<CompetitionList type='active' showAlert={showAlert}/>}
                            />
                        </Route>
                        <Route
                            path={'application'}
                        >
                            <Route
                                path={'my'}
                                element={<ApplicationList showAlert={showAlert}/>}
                            />
                            <Route
                                path={':id'}
                                element={<Application showAlert={showAlert} />}
                            />
                        </Route>
                    </Route>
                </Routes>
            </Router>
            <Snackbar open={isSnackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert variant="filled" severity={notificationState.type} closeFunction={handleSnackbarClose}>
                    {notificationState.text}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
}

export default App;
