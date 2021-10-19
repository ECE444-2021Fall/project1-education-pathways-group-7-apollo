import * as React from "react";
import { Link, Router } from "@reach/router";
import { SearchAndCourse } from "../components/SearchWithList";
import SignUp from "../components/SignUp";

const Login = () => (
  <div>
    <h2>Login</h2>
  </div>
);

function Home() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        {"  "}
        <Link to="login">Login</Link>
        {"  "}
        <Link to="signup">SignUp</Link>
      </nav>
      <Router>
        <SearchAndCourse path="/" />
        <Login path="/login" />
        <SignUp path="/signup" />
      </Router>
    </>
  );
}

export default Home;
