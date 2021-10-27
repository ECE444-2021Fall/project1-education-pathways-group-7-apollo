import React, { useState, useEffect } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { styled, FormControl, Typography, Button } from '@mui/material';
import Stack from '@mui/material/Stack';

const course_codes = [
    { title: 'Software Enginering', code: 'ECE444' },
    { title: 'Digital Electronics', code: 'ECE334' }
  ]
  
const MainContainer = styled("div")({
    width: '25vw',
    textAlign: 'left',
    alignSelf: 'center',
    borderRadius: 5,
    marginTop: '1vh',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    

    '& .MuiTextField-root': {
    margin: 5,
    width: '24.5vw',
    },
    '& .MuiButtonBase-root': {
    margin: 2,
    },
});

export default function CoursesTaken({ handler }) {
    // Store courses taken
    const [courses_taken, set_courses_taken] = useState([]);

    // New entry for every course taken
    const onChange = (event, value) => {
        set_courses_taken(value);
        handler(value);
    };


    return (
        <MainContainer>
            <Stack>
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
                    label="Select Previously Taken Courses"
                    placeholder="Select Course"
                />
                )}
            />
            </Stack>
        </MainContainer>
    );
}