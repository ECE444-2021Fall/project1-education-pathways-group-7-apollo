import { TextField } from '@material-ui/core';
import { FormControl, Button, styled, Typography, Select, MenuItem } from '@mui/material';

import React, { Component } from 'react';
import logo from '../app-logo.png';
import appBackground from '../app-background.png';
import axios from 'axios';
import { FormErrors } from './FormErrors';

const register = newUser => {
    return axios
        .post("users/signup", {
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            password: newUser.password,
            major: newUser.major,
            year: newUser.year
        })
        .then(response => {
            console.log("User Signed Up Successfully!")
        })
}

const year = [
    {label: '1', value: '1'},
    {label: '2', value: '2'},
    {label: '3', value: '3'},
    {label: '4+', value: '4'},
];

const validateUofTEmail = (email) => {
    return email.includes('@mail.utoronto.ca')
}

const Background = styled("div") ({
    position: 'absolute',
    width: '100%',
    height: '200%',
    left: '-3px',
    top: '0px',
    backgroundImage:`url(${appBackground})`
})

const MainContainer = styled("div")({
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    marginLeft: '25%',
    fontFamily: 'Bodoni Moda',
    fontsize: '10%',
    fontWeight: 'bold',
    backgroundColor:'#f7f6f6',
    display: 'flex',
    flexDirection: 'column',
    padding: 12,
    borderRadius: '5%',
    boxShadow: 3,
    color: "#4ac1c3",
    marginTop: '10%',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25)',

    '& .MuiTextField-root': {
    margin: 5,
    width: '300%',
    },
    '& .MuiButtonBase-root': {
    margin: 2,
    },
});

class SignUp extends Component {
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
            formErrors: {email: '', password: ''},
            emailValid: false,
            passwordValid: false,
            formValid: false
        } 
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange (e) {
        this.setState({ [e.target.name]: e.target.value }, 
            () => { this.validateField(e.target.name, e.target.value) })
    }

    onSubmit (e) {
        e.preventDefault()

        const { password, confirm_password } = this.state;

        if (password !== confirm_password) {
            alert("Passwords don't match!");
        } else {
            const newUser = {
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                password: this.state.password,
                confirm_password: this.state.confirm_password,
                major: this.state.major,
                year: this.state.year
            }

            register(newUser).then(res => {
                this.props.history.push(`/login`)
            })
        }

    }

    validateField(fieldName, value) {
        let password = this.state.password;
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
                    <div className="logo-container">
                            <img src={logo} style={{
                                width: "50%",
                                marginLeft: '25%',

                            }} alt="" />
                    </div>
                        <Typography 
                            style={{
                                fontFamily: 'Bodoni Moda',
                                fontSize: "200%",
                                textAlign: 'left',
                                paddingBottom: '3%',
                                marginLeft: '1%',
                                fontWeight: '500',
                                color: '#696969'
                            }}
                            variant="h1" 
                            component="h2">Create your account.</Typography>
                    <   div
                            style={{
                                fontFamily: 'Bodoni Moda',
                                fontSize: "120%",
                                textAlign: 'left',
                                marginLeft: '1%',
                                fontWeight: '500',
                                color:'#cc0000'

                        }}>
                        <FormErrors formErrors={this.state.formErrors} />
                        </div>
                        <TextField
                            style={{
                                position: 'relative',
                                fontFamily: 'Bodoni Moda',
                                width: '98%',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                borderRadius: '5%'
                            }}
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
                                width: '98%',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                borderRadius: '5%'
                            }}
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
                                width: '98%',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                borderRadius: '5%'
                            }}
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
                                width: '98%',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                borderRadius: '5%'
                            }}
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
                                width: '98%',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                borderRadius: '5%'
                            }}
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
                                width: '98%',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                borderRadius: '5%'
                            }}
                            label="Major"
                            variant="filled"
                            name="major"
                            placeholder="Please Enter Your Major"
                            value={this.state.major}
                            onChange={this.onChange} />
                        <Select 
                            style={{
                                position: 'relative',
                                borderRadius: 5,
                                width: '98%',
                                fontSize: "100%",
                                marginTop: '1%',
                                marginLeft:  '1%',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                borderRadius: '5%'
                            }}
                            name="year" 
                            value={this.state.year} 
                            onChange={this.onChange}
                            label="year"
                            variant='filled'
                            >
                            <MenuItem disabled value={0}>
                                Select Year
                            </MenuItem>
                            {year.map((option) => (
                                <MenuItem value={option.value}>{option.label}</MenuItem>
                            ))}
                        </Select>
                        <Button 
                            style={{
                                fontFamily: 'Bodoni Moda',
                                color: '#696969',
                                borderRadius: 5,
                                width: '99%',
                                backgroundColor: "#4ac1c3",
                                fontSize: "80%",
                                marginTop: '5%',
                                marginBottom: '5%',
                                fontWeight: 'bold',
                                paddingTop: '3%',
                                paddingBottom: '3%',
                                mixBlendMode: 'multiply',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                            }}
                            variant="contained"
                            type="submit"  
                            className="btn btn-lg btn-primary btn-block"
                            disabled={!this.state.formValid}>
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