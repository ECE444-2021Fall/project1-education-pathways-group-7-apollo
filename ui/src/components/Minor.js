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
    backgroundColor:'#e1e0e0',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    

    '& .MuiTextField-root': {
    margin: 5,
    width: '24.5vw',
    },
    '& .MuiButtonBase-root': {
    margin: 2,
    },
});

export default function CoursesTaken({ handleMinor }) {
    // Store Major
    const [minor, setMinor] = useState('');

    // This data will be populated from the fetch API
    const [shownAllMinors, setShownAllMinors] = useState([]);


    useEffect(async () => {
        let engMinors = [];
        let minorCodes = [];
        const fetchEngMinors = async () => {
            let engMinorsList = []
            await axios.get("http://localhost:5000/api/all_detailed_eng_minors_name")
            .then((response) => {
                const minors = [];
                for (var i = 0; i < Object.keys(response.data).length; i = i + 1) {
                    minors.push(Object.keys(response.data)[i]);
                }
                engMinorsList = minors
            });
            return engMinorsList
        };
        const fetchMinorCodes= async () => {
            let minorCodesList = []
            await axios.get( "http://localhost:5000/api/all_minors_id")
            .then((response) => {
                const minors = [];
                for (var i = 0; i < Object.keys(response.data).length; i = i + 1) {
                    minors.push(Object.keys(response.data)[i]);
                }
                minorCodesList = minors;
            });
            return minorCodesList
        };

        fetchEngMinors()
          .then(response => {
            engMinors = response
            fetchMinorCodes()
              .then(response => {
                minorCodes = response

                const allMinors = engMinors.concat(minorCodes);
                setShownAllMinors(allMinors);
              })
              .catch(error => console.error(error))
          })
          .catch(error => console.error(error))
    }, [])

    // New entry for every course taken
    const onChange = (event, value) => {
        setMinor(value);
        handleMinor(value);
    };

    return (
        <MainContainer>
            <Stack>
            <Autocomplete
                value={minor}
                onChange={onChange}
                options={shownAllMinors}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label="Minor"
                    placeholder="Select Minor (Optional)"
                />
                )}
            />
            </Stack>
        </MainContainer>
    );
}