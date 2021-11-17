import { Link } from "@reach/router";
import { TextField } from "@material-ui/core";
import { useState } from "react";
import {
  FormControl,
  Button,
  styled,
  Typography,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";

export const Login = ({ onFormSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invalidCredentialsAlert, setInvalidCredentialsAlert] = useState(false);

  // Method for when form is submitted
  const onSubmit = (e) => {
    e.preventDefault();

    // Call method to validate user credentials
    const result = onFormSubmit(username, password);

    result.then((res) => {
      // If res == true, it means invalid credentials
      if (res) {
        setInvalidCredentialsAlert(true);

        // Reset fields
        setUsername("");
        setPassword("");
      } else {
        setInvalidCredentialsAlert(false);

        // Reset fields
        setUsername("");
        setPassword("");
      }
    });
  };

  return (
    <div
      className="login-page-background"
      style={{
        position: "absolute",
        height: "300vh",
        width: "100vw",
        backgroundImage: "url(/app-background.png)",
      }}
    >
      <div className="login-main-container">
        {/* Alerts only active when form submission reveals a problem */}
        {invalidCredentialsAlert && (
          <Alert severity="error">Invalid credentials. Please try again!</Alert>
        )}
        <form className="login-form" onSubmit={onSubmit}>
          <div style={{ alignSelf: "center" }}>
            <img
              src="/app-logo.png"
              style={{
                width: "35vh",
              }}
              alt=""
            />
          </div>
          <Typography
            style={{
              fontSize: "200%",
              textAlign: "center",
              paddingBottom: "1vh",
              fontWeight: "500",
              color: "#696969",
            }}
            variant="h1"
            component="h2"
          >
            Welcome back!
          </Typography>
          <TextField
            style={{
              position: "relative",
              fontFamily: "Bodoni Moda",
              width: "25vw",
              alignSelf: "center",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              borderRadius: "5%",
            }}
            label="Email"
            variant="filled"
            required
            name="email"
            data-testid="email-field"
            placeholder="your_email@mail.utoronto.ca"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div style={{ padding: "5px" }}></div>
          <TextField
            style={{
              position: "relative",
              width: "25vw",
              alignSelf: "center",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              borderRadius: "5%",
            }}
            type="password"
            label="Password"
            variant="filled"
            data-testid="password-field"
            required
            name="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            style={{
              color: "#696969",
              borderRadius: 5,
              width: "25vw",
              alignSelf: "center",
              backgroundColor: "#4ac1c3",
              fontSize: "80%",
              marginTop: "2vh",
              marginBottom: "2vh",
              fontWeight: "bold",
              paddingTop: "1vh",
              alignSelf: "center",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            }}
            variant="contained"
            type="submit"
            className="btn btn-lg btn-primary btn-block"
          >
            Login
          </Button>
        </form>

        <div className="login-forgot-password">
          <footer>
            <Link to="/password-recovery">
              <Typography>Forgot your password?</Typography>
            </Link>
          </footer>
        </div>
        <div className="login-create-account">
          <footer>
            <Typography>
              Don't have an account? <Link to="/signup">Sign up!</Link>{" "}
            </Typography>
          </footer>
        </div>
      </div>
    </div>
  );
};
