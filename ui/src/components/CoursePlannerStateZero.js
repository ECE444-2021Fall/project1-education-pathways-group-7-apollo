import * as React from 'react';
import Button from '@mui/material/Button';
import { useState } from "react";
import { styled } from '@mui/material/styles';

export const StateZero = (props) => {
  const categories = ['2021/2022', '2022/2023', '2023/2024', '2024/2025']

  const [selectedZero, setSelectedZero] = useState('');

  const clickZero = (value) => {
    setSelectedZero(value) 
    props.clickZero(value)
   };  

  /*const clickReset = () => {
    const tempArray = []
    props.setCourse(tempArray)
  };*/

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