import React, { useEffect, useState } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material';
import Stack from '@mui/material/Stack';
import axios from 'axios';

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

export default function CoursesTaken({ handleMajor }) {
    // Store Major
    const [major, set_major] = useState('');

    // This data will be populated from the fetch API
    const [shownMajors, setShownMajors] = useState([]);

    const fetchMajors = () => {
        axios.get( "http://localhost:5000/api/all_majors_id")
        .then((response) => {
            const majors = [];
            for (var i = 0; i < Object.keys(response.data).length; i = i + 1) {
                majors.push(Object.keys(response.data)[i]);
            }
            setShownMajors(majors);
        });
    };

    useEffect(() => fetchMajors(), [])

    // New entry for every course taken
    const onChange = (event, value) => {
        set_major(value);
        handleMajor(value);
    };

    return (
        <MainContainer>
            <Stack>
            <Autocomplete
                value={major}
                onChange={onChange}
                options={shownMajors}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label="Major"
                    placeholder="Select Major"
                />
                )}
            />
            </Stack>
        </MainContainer>
    );
}