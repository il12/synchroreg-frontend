import React, {} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function CompetitionStatistic(props) {
    const routinesMap = {
        solo: "Соло",
        duet: "Дуэт",
        mixed: "Смешанный дуэт",
        team: "Группа",
        highlight: "Акробатическая группа",
        combi: "Комби",
    }
    console.log(props);
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: "center",
            alignItems: 'stretch',
            margin: 2,
            borderTop: "1px solid black",
            borderBottom: "1px solid black"
        }}>
            <Typography variant={'h4'} textAlign={"center"}>Статистика</Typography>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: "space-around",
                alignItems: 'stretch',
                margin: 2,
            }}>
                <Box sx={{
                    overflowY: 'auto',
                    maxHeight: "45vh",
                    maxWidth: "25%"
                }}>
                    <Typography variant={"h5"}>Заявленные команды:</Typography>
                    <ol>
                        {props.data?.teams && props.data?.teams.map((item) => {
                            return <li>
                                {item}
                            </li>
                        })}
                    </ol>
                </Box>
                <Box>
                    <Typography variant={"h5"}>Спортсмены:</Typography>
                    <ul>
                        <li>
                            {props?.data?.athletesCount && `${props.data?.athletesCount} человек`}
                        </li>
                    </ul>
                </Box>
                <Box>
                    <Typography variant={"h5"}>Персонал:</Typography>
                    <ul>
                        <li>
                            {props?.data.staffCount && `${props.data.staffCount} человек`}
                        </li>
                    </ul>

                </Box>
                <Box>
                    <Typography variant={"h5"}>Произвольные:</Typography>
                    <ul>
                        {props?.data?.routinesCount?.free && Object.keys(props.data?.routinesCount.free).map((item) => {
                            return <li>
                                {routinesMap[item]}: {props.data.routinesCount.free[item]}
                            </li>
                        })}
                    </ul>
                </Box>
                <Box>
                    <Typography variant={"h5"}>Технические:</Typography>
                    <ul>
                        {props?.data?.routinesCount?.tech && Object.keys(props.data?.routinesCount.tech).map((item) => {
                            return <li>
                                {routinesMap[item]}: {props.data.routinesCount.tech[item]}
                            </li>
                        })}
                    </ul>
                </Box>
            </Box>
        </Box>
    )

}

export default CompetitionStatistic
