import * as React from "react";
import { Link, Router } from "@reach/router";
import { SearchAndCourse } from "../components/SearchWithList";

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
      </nav>
      <Router>
        <SearchAndCourse path="/" />
        <Login path="/login" />
      </Router>
    </>
  );
}

export default Home;
