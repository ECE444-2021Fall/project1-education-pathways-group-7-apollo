import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export const StateZero = (props) => {
  return(
  <> 
    <h3>Select a school year!</h3>
    <Button size="medium" variant="contained" disableElevation>2021/2022</Button> &nbsp; 
    <Button size="medium" variant="contained" disableElevation>2022/2023</Button> &nbsp;
    <Button size="medium" variant="contained" disableElevation>2023/2024</Button> &nbsp;
    <Button size="medium" variant="contained" disableElevation>2024/2025</Button> &nbsp;
    <br></br>
    <br></br>
    <Button size="small" variant="text" disableElevation onClick={props.next}>Next</Button>
  </>
  )
};