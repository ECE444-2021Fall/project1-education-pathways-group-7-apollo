import * as React from "react";
import { Link, Router } from "@reach/router";
import { SearchAndCourse } from "../components/SearchWithList";
import { Login } from "../components/Login"
import { useState, useEffect } from "react"
import SignUp from "../components/SignUp";
import CoursesTaken from "../components/CoursesTaken";
import { ProgressBar } from "../components/ProgressBar";
import PersistentDrawerLeft from "../components/SidebarFilters";

function Home() {
  // To-Do: Write code to authenticate user. While authToken doesn't exist, we should show login page
  const [authToken, setAuthToken] = useState('')


  // To-Do: Implement credential checking in backend for Login component
  const checkCredentials = (loginInfo) => {
    console.log('CHECKING INFO', loginInfo)
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
        <Link to="sidebar-filters">SidebarFilters</Link>
        {"  "}
        <Link to="courses-taken">CoursesTaken</Link>
        {"  "}
        <Link to="progress-bar">ProgressBar</Link>
      </nav>
      <Router>
        <SearchAndCourse path="/" />
        <Login path="/login" onFormSubmit={checkCredentials} />
        <SignUp path="/signup" />
        <CoursesTaken path="/signup/courses-taken" />
        <ProgressBar path="/progress-bar" />
        <PersistentDrawerLeft path="/sidebar-filters" />
      </Router>
    </>
  );
}

export default Home;
