import * as React from "react";
import { Link, Router } from "@reach/router";
import { SearchAndCourse } from "../components/SearchWithList";
import { Login } from "../components/Login"
import { useState, useEffect } from "react"

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
      </nav>
      <Router>
        <SearchAndCourse path="/" />
        <Login path="/login" onFormSubmit={checkCredentials} />
      </Router>
    </>
  );
}

export default Home;
