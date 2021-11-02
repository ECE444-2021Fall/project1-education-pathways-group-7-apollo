import React, { useEffect, useState } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material';
import Stack from '@mui/material/Stack';
import axios from 'axios';

function createData(code, title) {
return {
    code,
    title
};
}
  
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

    // This data will be populated from the fetch API
    const [shownCourses, setShownCourses] = useState([]);

    const fetchCourses = () => {
        axios.get( "http://localhost:5000/api/all_courses_id")
        .then((response) => {
            const courses = [];
            for (const course in response.data) {
            courses.push(
                createData(
                response.data[course].Code,
                response.data[course].Name
                )
            );
            }
            setShownCourses(courses);
            console.log(setShownCourses);
        });
    };

    useEffect(() => fetchCourses(), [])

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
                options={shownCourses}
                getOptionLabel={(option) => option.code}
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