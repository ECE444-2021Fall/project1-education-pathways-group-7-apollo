import * as React from 'react';
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useState } from "react";
import { styled } from '@mui/material/styles';

export const StateTwo = (props) => {



    const deleteCourse = (currentCourse) => {

        const tempAddedCourses = [...props.addedCourses];

        if (tempAddedCourses.length>-1){
            for (let i=0; i<tempAddedCourses.length; i++){
                if (tempAddedCourses[i]===currentCourse){
                    tempAddedCourses.splice(i, 1);
                }
            }
        }
        props.deleteCourse(tempAddedCourses)
    }
    return(
        <>
            <List component={Stack} direction="row">
                {props.addedCourses.map((currentCourse) => {
                    return (
                        <ListItemButton onClick={() => {deleteCourse(currentCourse)}}>{currentCourse}</ListItemButton>)
                })}
            </List>
            <p>Click on a course to delete!</p>
        <Button size="small" variant="text" disableElevation onClick={props.prev}>Back</Button>
        <Button size="small" variant="text" disableElevation >Save</Button>
        </>
    )
    };