import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import { StateZero } from "./CoursePlannerStateZero";
import { StateOne } from "./CoursePlannerStateOne";
import { StateTwo } from "./CoursePlannerStateTwo";
import CoursePlannerServices from "../services/CoursePlannerServices";
import { useLocalStorage } from "../components/useLocalStorage";

export function CoursePlanner({addedCourses, setCourse, userInfo}) {
  const [step, setStep] = useState(0);

  const [selectedZero, setSelectedZero] = useState('');

  const [selectedOne, setSelectedOne] = useState('');

  const [prevCourses, setPrevPlanner] = useState([]);


  const prevPlanner = async () => {
    const email = userInfo["email"]
    const year = selectedZero
    const term = selectedOne
    const user = { "email": email, "year": year, "semester": term }
  
    await CoursePlannerServices.getCoursePlannerByID(user)
    .then(response => {

        const courseLists = response.data
        if (courseLists.courses.length>-1){
            localStorage.setItem(`${year}${term}`, courseLists.courses)
            // setPrevPlanner(courseLists.courses)
        }
      })
    .catch(err => {
        console.error("Previous planner not found", err)
      })
  };

  const clickZero = (value) => {
    setSelectedZero(value) 
   };  

  const clickOne = (value) => {
    setSelectedOne(value) 
   };  

  const nextStep = () => {
    if (step===1) {
      prevPlanner()
      .then(() => {setStep((prev) => prev + 1)} )
    }
    else{
      if (step !== 2) setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (step !== 0) setStep((prev) => prev - 1);
  };

  const setCourseTwo = (currentCourse) => {
    setCourse(currentCourse)
  };

  const setNewPrevCourse = (newPrevCourse) => {
    setPrevPlanner(newPrevCourse)
  };

  return (
    <div>
      <Box>
        <h1>Course Planner</h1>
        {step === 0 ? <StateZero next={nextStep} clickZero={clickZero} addedCourses={addedCourses} setCourse={setCourseTwo}/> : null}
        {step === 1 ? <StateOne next={nextStep} prev={prevStep} clickOne={clickOne}/> : null}
        {step === 2 ? <StateTwo prev={prevStep} setNewPrevCourse={setNewPrevCourse} addedCourses={addedCourses} setCourse={setCourseTwo} selectedZero={selectedZero} selectedOne = {selectedOne} userState={userInfo} prevCourses={prevCourses}/> : null} 
      </Box>
    </div>
  );
}
