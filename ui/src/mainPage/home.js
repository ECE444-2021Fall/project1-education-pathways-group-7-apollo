import * as React from "react";
import { Link, Router } from "@reach/router";
import { SearchAndCourse } from "../components/SearchWithList";
import { Login } from "../components/Login"
import { useState, useEffect } from "react"
import SignUp from "../components/SignUp";
import { ProgressBar } from "../components/ProgressBar";
import PersistentDrawerLeft from "../components/SidebarFilters";
import UserServices from "../components/UserServices";
import { useLocalStorage } from "../components/useLocalStorage";
import CourseService from "../services/CourseService";

function Home() {
  // Upon login, save user name, id, year, major, courses_taken, and major requirements
  // These states will persist over refresh/new tab
  const [loggedIn, setLoggedIn] = useLocalStorage("loggedIn", false)
  const [userState, setUserState] = useLocalStorage("user", {})
  const [majorCourses, setMajorCourses] = useLocalStorage("majorCourses", [])
  const [minorsRequirements, setMinorsRequirements] = useLocalStorage("minorsRequirements", [])

  // Credential checking in backend for Login component
  const checkCredentials = async (username, password) => {
    const options = {
      method: 'POST',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    }
    
    // Collect response values here
    let invalidCredentials = true
    let loggedInResponse = false
    let userStateResponse = {}

    // Send request to check credentials
    await UserServices.authenticateUser(options)
      .then(response => { 
        const matchedUser = response.data

        // matchedUser.id == null if no user was found
        if (matchedUser.id) {
          // Collect information about user state
          loggedInResponse = true
          userStateResponse = matchedUser

          // Let login component know everything's gucci
          invalidCredentials = false
        }
      })
      .catch(err => {
        console.error("Problem with user credential checking", err)
      })
    
    // Now, if we have successfully logged in, grab the courseMajor requirements for user's major here
    // We will also grab information about the user's minors here
    let coursesForMajor = []
    let minorsRequirementsList = []
    if (loggedInResponse) {
      const userMajor = userStateResponse['major']
      await CourseService.getCoursesForMajor(userMajor)
        .then(response => {
            coursesForMajor = response.data[userMajor]
        })
        .catch(err => {
          console.error("Problem with getting courses for major", err)
        })
      
      // I AM ASSUMING WE'RE NOT GONNA HAVE OUR DEMO USER PICK A NON-ENG MINOR
      const userMinor = userStateResponse['minor']
      
      // Now, get the information for eng_minor
      await CourseService.getRequirementsForMinor(userMinor)
      .then(response => {
        minorsRequirementsList.push(response.data)
      })
      .catch(err => {
        console.error("Problem with getting minor requirements", err)
      })    
    }
    // Set state values
    setMajorCourses(coursesForMajor)
    setMinorsRequirements(minorsRequirementsList)
    setUserState(userStateResponse)
    setLoggedIn(loggedInResponse)

    return invalidCredentials
  }
  
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        {"  "}
        <Link to="login">Login</Link>
        {"  "}
        <Link to="signup">SignUp</Link>
        {"  "}
        <Link to="password-recovery">ForgotPassword</Link>

        <Link to="sidebar-filters">SidebarFilters</Link>
        {"  "}
        <Link to="progress-bar">ProgressBar</Link>
      </nav>
      <Router>
        {/* Display login page if user is not logged in  */}
        {loggedIn ? <SearchAndCourse path="/" userInfo={userState} majorCourses={majorCourses} minorsRequirements={minorsRequirements}/> : <Login path="/" onFormSubmit={checkCredentials} />}
        {/* <SearchAndCourse path="/" />
        <Login path="/login" onFormSubmit={checkCredentials} /> */}
        <SignUp path="/signup" />
        <ProgressBar path="/progress-bar" />
        <PersistentDrawerLeft path="/sidebar-filters" />
      </Router>
    </>
  );
}

export default Home;
