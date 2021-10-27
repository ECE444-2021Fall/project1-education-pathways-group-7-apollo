import React, { useEffect, useState, Component } from "react";
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { styled, FormControl, Typography, Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import axios from 'axios';

const course_codes = [
  { title: 'Software Enginering', code: 'ECE444' },
  { title: 'Digital Electronics', code: 'ECE334' }
]

const Background = styled("div") ({
    position: 'absolute',
    width: '100vw',
    height: '300vh',
    backgroundImage:"url(/app-background.png)"
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
    flexDirection: 'column',
    padding: 12,
    borderRadius: '5vh',
    boxShadow: 3,
    color: "#4ac1c3",
    marginTop: '10vh',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25)',

    '& .MuiTextField-root': {
    margin: 5,
    width: '24.5vw',
    },
    '& .MuiButtonBase-root': {
    margin: 2,
    },
});

export default function CoursesTaken() {
    // Store courses taken
    const [courses_taken, set_courses_taken] = useState([]);

    // New entry for every course taken
    const onChange = (event, value) => {
        set_courses_taken(value);
    };

    // Method for when form is submitted
    const onSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <Background>
            <MainContainer>
            <FormControl className="sign-up" onSubmit={onSubmit}>
                <div style={{    alignSelf: 'center'    }}>
                    <img src="/app-logo.png" style={{
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
                        component="h2">Select all courses previously taken.</Typography>
                <Stack 
                    style={{
                        position: 'relative',
                        fontFamily: 'Bodoni Moda',
                        width: '25vw',
                        alignSelf: 'center',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        borderRadius: '5%',
                    }}>
                <Autocomplete
                    multiple
                    value={courses_taken}
                    onChange={onChange}
                    options={course_codes}
                    getOptionLabel={(option) => option.title}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Courses"
                        placeholder="Select Course"
                    />
                    )}
                />
                </Stack>
                <Button 
                    style={{
                        fontFamily: 'Bodoni Moda',
                        color: '#f7f6f6',
                        borderRadius: 5,
                        width: '25vw',
                        alignSelf: 'center',
                        backgroundColor: "#4ac1c3",
                        fontSize: "80%",
                        marginTop: '2vh',
                        marginBottom: '2vh',
                        fontWeight: 'bold',
                        paddingTop: '1vh',
                        paddingBottom: '1vh',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    }}
                    variant="contained"
                    type="submit"  
                    className="btn btn-lg btn-primary btn-block">
                    Done!
                </Button>
            </FormControl>
            </MainContainer>
        </Background>
    );
}