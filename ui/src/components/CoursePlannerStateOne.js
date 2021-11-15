import * as React from 'react';
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import { useState } from "react";
import { styled } from '@mui/material/styles';

export const StateOne = (props) => {
  return(
    <> 
    <h3>Select a study term!</h3>
    <Button size="medium" variant="contained" disableElevation>Fall</Button> &nbsp;
    <Button size="medium" variant="contained" disableElevation>Winter</Button> &nbsp;
    <Button size="medium" variant="contained" disableElevation>Summer</Button> &nbsp;
    <br></br>
    <br></br>
    <Button size="small" variant="text" disableElevation onClick={props.prev}>Back</Button>
    <Button size="small" variant="text" disableElevation onClick={props.next}>Next</Button>
    </>
  )
};