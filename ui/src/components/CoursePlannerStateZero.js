import * as React from 'react';
import Button from '@mui/material/Button';
import { useState } from "react";
import { styled } from '@mui/material/styles';

export const StateZero = (props) => {
  //Users select year of choosing for course planner
  const categories = ['2021/2022', '2022/2023', '2023/2024', '2024/2025']

  const [selectedZero, setSelectedZero] = useState('');

  //Button will be highlighted to show it is selected
  const clickZero = (value) => {
    setSelectedZero(value) 
    props.clickZero(value)
   };  

   return (
    <>
    <h3>Select a school year!</h3>
      {categories.map(category => {
        return <Button onClick={()=>{clickZero(category)}} variant={selectedZero === category ? 'contained':'outlined'}>{category}</Button>
      })}
      <br></br>
      <br></br>
      <Button size="small" variant = "text" disable Elevation onClick={props.next}>Next</Button>
    </>
  )
};