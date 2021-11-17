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

export const StateTwo = (props) => {
    // Copy the addedcourses array. We'll modify this copy until the user decides to save
    
    const [copyOfAddedCourses, setcopyofAddedCourses] = useState([...props.addedCourses]);
    //}
    console.log("COMPONENT RERENDERING", [...props.addedCourses], copyOfAddedCourses)

    useEffect(() => { setcopyofAddedCourses([...props.addedCourses])}, [])

    //useEffect(() => {
      //  prevPlanner();
      //}, [])

    const savePlanner = () => {
        const email = props.userState["email"]
        const year = props.selectedZero
        const term = props.selectedOne
        const courseList = copyOfAddedCourses

        const body = { email: email, year: year, term: term, courses: courseList }

        console.log(body)

        CoursePlannerServices.saveCoursePlanner(body)
        .then(response => { 
            console.log("Planner is saved!", response)
            props.setCourse(copyOfAddedCourses)
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
        
        setcopyofAddedCourses(tempAddedCourses)
       
    };

    //console.log(request_complete)
    
    //if (request_complete) {
    return (    
    <>
        <List component={Stack} direction="row">
            {copyOfAddedCourses.map((currentCourse) => {
                return (
                    <ListItemButton onClick={() => {deleteCourse(currentCourse)}}>{currentCourse}</ListItemButton>)
            })}
        </List>
        <p>Click on a course to delete!</p>
        <Button size="small" variant="text" disableElevation onClick={props.prev}>Back</Button>
        <Button size="small" variant="text" disableElevation onClick={() => {savePlanner()}}>Save</Button>
    </>)

   // else return (<></>)
};