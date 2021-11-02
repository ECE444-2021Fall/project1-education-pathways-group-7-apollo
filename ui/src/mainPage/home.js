import * as React from "react";
import { Link, Router } from "@reach/router";
import { SearchAndCourse } from "../components/SearchWithList";
import { Login } from "../components/Login"
import { useState, useEffect } from "react"
import SignUp from "../components/SignUp";
import { ProgressBar } from "../components/ProgressBar";
import PersistentDrawerLeft from "../components/SidebarFilters";
import UserServices from "../components/UserServices";

function Home() {
  // State to track information of current logged in user, and whether user is logged in or not
  const [loggedInUserInfo, setLoggedInUserInfo] = useState({id:'', firstName: '', lastName: ''})
  const [loggedIn, setLoggedIn] = useState(false)

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
    
    let invalidCredentials = true

    // Send request
    await UserServices.authenticateUser(options)
      .then(response => { 
        const matchedUser = response.data

        // matchedUser.id == null if no user was found
        if (matchedUser.id) {
          setLoggedInUserInfo({id: matchedUser.id, firstName: matchedUser.firstName, lastName: matchedUser.lastName})
          setLoggedIn(true)

          // Let login component know everything's gucci
          invalidCredentials = false
        }
      })
      .catch(err => {
        console.error(err)
      })
    
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
        {/* TO-Do: Here we can conditionally display login page. If loggedIn ? <SearchAndCourse/> : <Login />  */}
        <SearchAndCourse path="/" />
        <Login path="/login" onFormSubmit={checkCredentials} />
        <SignUp path="/signup" />
        <ProgressBar path="/progress-bar" />
        <PersistentDrawerLeft path="/sidebar-filters" />
      </Router>
    </>
  );
}

export default Home;
