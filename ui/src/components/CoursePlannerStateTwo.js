import * as React from 'react';
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useState } from "react";
import { styled } from '@mui/material/styles';

export const StateTwo = (props) => {

    return(
        <>
            <List component={Stack} direction="row">
                {props.addedCourses.map((currentCourse) => {
                    return <ListItem>{currentCourse}</ListItem>;
                })}
            </List>
        <br></br>
        <Button size="small" variant="text" disableElevation onClick={props.prev}>Back</Button>
        <Button size="small" variant="text" disableElevation >Save</Button>
        </>
    )
    };