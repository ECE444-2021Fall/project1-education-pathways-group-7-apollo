import * as React from 'react';
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import { useState } from "react";
import { styled } from '@mui/material/styles';

export const StateOne = (props) => {
  //Users select term of choosing for course planner
  const categories = ['Fall', 'Winter', 'Summer']

  const [selectedOne, setSelectedOne] = useState('');

  //Button will be highlighted to show it is selected
  const clickOne = (value) => {
    setSelectedOne(value)
    props.clickOne(value)

   };   

  return(
    <> 
    <h3>Select a study term!</h3>
      {categories.map(category => {
        return <Button onClick={()=>{clickOne(category)}} variant={selectedOne === category ? 'contained':'outlined'}>{category}</Button>
      })}
    <br></br>
    <br></br>
    <Button size="small" variant="text" disableElevation onClick={props.prev}>Back</Button>
    <Button size="small" variant="text" disableElevation onClick={props.next}>Next</Button>
    </>
  )
};