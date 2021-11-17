import * as React from 'react';
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import CoursePlannerServices from "../services/CoursePlannerServices";
import { Card } from '@mui/material';

export const StateTwo = ({prev, setNewPrevCourse, addedCourses, setCourse, selectedZero, selectedOne, userState, prevCourses}) => {
    // Grab the user's prior saved courses
    let prevPlanCourses = []
    if (localStorage.getItem(`${selectedZero}${selectedOne}`)) {
        prevPlanCourses = localStorage.getItem(`${selectedZero}${selectedOne}`).split(',')
    }
    

    // Create a state for copying added courses so we don't modify prop every single time we delete course
    const [copyOfAddedCourses, setCopyofAddedCourses] = useState([])

    // Whenever addedCourses props changes, update copyOfAddedCourses as well
    useEffect(() => {
        let unique = []
        addedCourses.forEach((course) => {
            if (!prevPlanCourses.includes(course)) {
                unique.push(course)
            }
        })
        prevPlanCourses.forEach((course) => {
            if (!unique.includes(course)) {
                unique.push(course)
            }
        })
        setCopyofAddedCourses([...unique])
    }, [JSON.stringify(addedCourses)]) // JSON.stringify courses prevents dependency from being an array, which has different memory each time

    
    console.log("copyOfAddedCourses", copyOfAddedCourses)

    const savePlanner = () => {
        const email = userState["email"]
        const year = selectedZero
        const term = selectedOne
        const courseList = copyOfAddedCourses

        const body = { email: email, year: year, term: term, courses: courseList }

        console.log(body)

        CoursePlannerServices.saveCoursePlanner(body)
        .then(response => { 
            console.log("Planner is saved!")
            localStorage.removeItem(`${selectedZero}${selectedOne}`)
            setCourse(copyOfAddedCourses)
        })
        .catch(err => {
            console.error("Planner not saved", err)
        })
    };

    const deleteCourse = (currentCourse) => {
        const tempAddedCourses = copyOfAddedCourses

        if (tempAddedCourses.length>-1){
            for (let i=0; i<tempAddedCourses.length; i++){
                if (tempAddedCourses[i]===currentCourse){

                    tempAddedCourses.splice(i, 1);
                }
            }
        }
        savePlanner()
    };

    const coursesToDisplay = copyOfAddedCourses.map((currentCourse) => {
        return (
            <ListItemButton autoFocus={true} onClick={() => {deleteCourse(currentCourse)}}>{currentCourse}</ListItemButton>
            )
        })

    return (    
    <>
        <List component={Stack} direction="row">
        <Card variant="outlined" style={{width: "20vw", backgroundColor: "#f7f6f6", paddingLeft: "10px", borderRadius: "10px"}}>
            {coursesToDisplay}
        </Card>
        </List>
        <p>Click on a course to delete!</p>
        <Button size="small" variant="text" disableElevation onClick={prev}>Back</Button>
        <Button size="small" variant="text" disableElevation onClick={() => {savePlanner()}}>Save</Button>
    </>)

   // else return (<></>)
};