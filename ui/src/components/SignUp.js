import React, { Component } from "react";
import { TextField } from '@material-ui/core';
import { FormControl, Button, styled, Typography, Select, MenuItem } from '@mui/material';
import { FormErrors } from './FormErrors';
import UserService from './UserServices';
import CoursesTaken from "./CoursesTaken";

const year = [
    {label: '1', value: '1'},
    {label: '2', value: '2'},
    {label: '3', value: '3'},
    {label: '4+', value: '4'},
];

const Background = styled("div") ({
    position: 'absolute',
    width: '100vw',
    height: '300vh',
    backgroundImage:"url(/app-background.png)"
})

const MainContainer = styled("div")({
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    marginLeft: '35vw',
    fontFamily: 'Bodoni Moda',
    fontsize: '10vh',
    fontWeight: 'bold',
    backgroundColor:'#f7f6f6',
    flexDirection: 'column',
    padding: 12,
    borderRadius: '5vh',
    boxShadow: 3,
    color: "#4ac1c3",
    marginTop: '10vh',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25)',

    '& .MuiTextField-root': {
    margin: 5,
    width: '300vh',
    },
    '& .MuiButtonBase-root': {
    margin: 2,
    },
});

class SignUp extends Component {
    // Store user information
    constructor() {
        super()
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            confirm_password: '',
            major: '',
            year: '',
            courses_taken: [],
            formErrors: {email: '', password: ''},
            emailValid: false,
            passwordValid: false,
            formValid: false
        } 
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.handler = this.handler.bind(this)
    }

    // Modify state  of field based on user input
    onChange (e) {
        this.setState({ [e.target.name]: e.target.value }, 
            () => { this.validateField(e.target.name, e.target.value) })
    }

    // saves courses taken into state array
    handler(courses) {
        this.setState({
          courses_taken: courses  
        })
      }

    // Validate form and create a new user
    onSubmit (e) {
        e.preventDefault()
    
        const newUser = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password,
            major: this.state.major,
            year: this.state.year,
            courses_taken: this.state.courses_taken
        }

        UserService.createUser(newUser)
        .then(res => { console.log(res.data); })
        .catch(err => console.log(err.response.data));
    }

    // Valid a UofT email is used and validate that password is not too short
    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;

        switch(fieldName) {
            case 'email':
                emailValid = (value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) && value.includes('@mail.utoronto.ca');
                fieldValidationErrors.email = emailValid ? '' : ' is invalid, please enter a valid UofT email!';
                break;
            case 'password':
                passwordValid = value.length >= 6;
                fieldValidationErrors.password = passwordValid ? '': ' is too short!';
                break;
            default:
                break;
        }
        this.setState({formErrors: fieldValidationErrors,
                        emailValid: emailValid,
                        passwordValid: passwordValid
                      }, this.validateForm);
    }

    validateForm() {
    this.setState({formValid: this.state.emailValid && this.state.passwordValid});
    }

    errorClass(error) {
    return(error.length === 0 ? '' : 'has-error');
    }

    render () {


        return (         
            <>
            <Background>
                <MainContainer sx={{ boxShadow: 3 }}>               
                    <FormControl className="sign-up" onSubmit={this.onSubmit}>
                        <div style={{    alignSelf: 'center'    }}>
                                <img src="/app-logo.png" style={{
                                    width: "35vh"
                                }} alt="" />
                        </div>
                            <Typography 
                                style={{
                                    fontFamily: 'Bodoni Moda',
                                    fontSize: "200%",
                                    textAlign: 'left',
                                    paddingBottom: '1vh',
                                    fontWeight: '500',
                                    color: '#696969'
                                }}
                                variant="h1" 
                                component="h2">Create your account.</Typography>
                        <div
                            style={{
                                fontFamily: 'Bodoni Moda',
                                fontSize: "120%",
                                textAlign: 'left',
                                marginLeft: '1vh',
                                fontWeight: '500',
                                color:'#cc0000'

                        }}>
                        <FormErrors formErrors={this.state.formErrors} />
                        </div>
                        <TextField
                            style={{
                                position: 'relative',
                                fontFamily: 'Bodoni Moda',
                                width: '25vw',
                                alignSelf: 'center',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                borderRadius: '5%',
                            }}
                            data-testid="first-name-input"
                            label="First Name"
                            variant="filled"
                            required
                            name="first_name"
                            placeholder="Enter First Name"
                            value={this.state.first_name}
                            onChange={this.onChange} />
                        <TextField
                            style={{
                                position: 'relative',
                                fontFamily: 'Bodoni Moda',
                                width: '25vw',
                                alignSelf: 'center',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                borderRadius: '5%'
                            }}
                            data-testid="last-name-input"
                            label="Last Name"
                            variant="filled"
                            required
                            name="last_name"
                            placeholder="Enter Last Name"
                            value={this.state.last_name}
                            onChange={this.onChange} />
                        <TextField
                            style={{
                                position: 'relative',
                                fontFamily: 'Bodoni Moda',
                                width: '25vw',
                                alignSelf: 'center',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                borderRadius: '5%'
                            }}
                            data-testid="email-input"
                            label="Email"
                            variant="filled"
                            required
                            name="email"
                            placeholder="Enter Email"
                            value={this.state.email}
                            onChange={this.onChange} />
                        <TextField
                            style={{
                                position: 'relative',
                                fontFamily: 'Bodoni Moda',
                                width: '25vw',
                                alignSelf: 'center',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                borderRadius: '5%'
                            }}
                            data-testid="password-input"
                            type="password"
                            label="Password"
                            variant="filled"
                            required
                            name="password"
                            placeholder="Enter Password"
                            value={this.state.password}
                            onChange={this.onChange} />
                        <TextField
                            style={{
                                position: 'relative',
                                fontFamily: 'Bodoni Moda',
                                width: '25vw',
                                alignSelf: 'center',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                borderRadius: '5%'
                            }}
                            data-testid="confirm-password-input"
                            type="password"
                            label="Confirm Password"
                            variant="filled"
                            required
                            name="confirm_password"
                            value={this.state.confirm_password}
                            placeholder="Confirm Password"
                            onChange={this.onChange} />
                        <TextField
                            style={{
                                position: 'relative',
                                fontFamily: 'Bodoni Moda',
                                width: '25vw',
                                alignSelf: 'center',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                borderRadius: '5%'
                            }}
                            data-testid="major-input"
                            label="Major"
                            variant="filled"
                            required
                            name="major"
                            placeholder="Please Enter Your Major"
                            value={this.state.major}
                            onChange={this.onChange} />
                        <Select 
                            style={{
                                position: 'relative',
                                alignSelf: 'center',
                                borderRadius: 5,
                                width: '25vw',
                                fontSize: "100%",
                                marginTop: '1vh',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                            }}
                            name="year" 
                            required
                            value={this.state.year} 
                            onChange={this.onChange}
                            variant='filled'
                            >
                            <MenuItem disabled value={0}>
                                Select Year
                            </MenuItem>
                            {year.map((option) => (
                                <MenuItem value={option.value}>{option.label}</MenuItem>
                            ))}
                        </Select>
                        <CoursesTaken handler={this.handler} />
                        <Button 
                            style={{
                                fontFamily: 'Bodoni Moda',
                                borderRadius: 5,
                                width: '25vw',
                                alignSelf: 'center',
                                backgroundColor: "#4ac1c3",
                                fontSize: "80%",
                                marginTop: '2vh',
                                marginBottom: '2vh',
                                fontWeight: 'bold',
                                paddingTop: '1vh',
                                paddingBottom: '1vh',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                            }}
                            variant="contained"
                            type="submit"  
                            className="btn btn-lg btn-primary btn-block"
                            disabled={!this.state.formValid}
                            onClick={this.onSubmit}>
                            Sign Up
                        </Button>
                    </FormControl>
                </MainContainer>
            </Background>
            </>
        )
    }
}

export default SignUp 
