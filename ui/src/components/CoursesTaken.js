import React, { useEffect, useState, Component } from "react";
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { styled, FormControl, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import logo from '../app-logo.png';
import appBackground from '../app-background.png';
import axios from 'axios';

const course_codes = [
  { title: 'Software Enginering', code: 'ECE444' },
  { title: 'Digital Electronics', code: 'ECE334' }
]

/*
const courses_taken = courses => {
    return axios
        .post("users/courses-taken", {
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            password: newUser.password,
            major: newUser.major,
            year: newUser.year
        })
        .then(response => {
            console.log("User Signed Up Successfully!")
        })
}
*/

const Background = styled("div") ({
    position: 'absolute',
    width: '100vw',
    height: '300vh',
    backgroundImage:`url(${appBackground})`
})

const MainContainer = styled("div")({
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    marginLeft: '35vw',
    fontFamily: 'Bodoni Moda',
    fontsize: '10vh',
    fontWeight: 'bold',
    backgroundColor:'#f7f6f6',
    display: 'flex',
    flexDirection: 'column',
    padding: 12,
    borderRadius: '5vh',
    boxShadow: 3,
    color: "#4ac1c3",
    marginTop: '10vh',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25)',

    '& .MuiTextField-root': {
    margin: 5,
    width: '300vh',
    },
    '& .MuiButtonBase-root': {
    margin: 2,
    },
});

export default function CoursesTaken() {
  return (
    <Background>
        <MainContainer>
        <FormControl className="sign-up" onSubmit={this.onSubmit}>
            <div style={{    alignSelf: 'center'    }}>
                    <img src={logo} style={{
                        width: "35vh"
                    }} alt="" />
            </div>
            <Typography 
                style={{
                    fontFamily: 'Bodoni Moda',
                    fontSize: "200%",
                    textAlign: 'left',
                    paddingBottom: '1vh',
                    fontWeight: '500',
                    color: '#696969'
                }}
                variant="h1" 
                component="h2">Create your account.</Typography>
            <Stack spacing={3} sx={{ width: 500 }}>
            <Autocomplete
                multiple
                id="tags-standard"
                options={course_codes}
                getOptionLabel={(option) => option.title}
                renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label="Select Course"
                    placeholder="Courses"
                />
                )}
            />
            </Stack>
        </FormControl>
        </MainContainer>
    </Background>
  );
}