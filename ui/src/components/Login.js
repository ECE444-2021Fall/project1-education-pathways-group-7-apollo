import {Link} from "@reach/router"
import { useState } from "react"
import { Alert } from "@mui/material"

export const Login = ({onFormSubmit}) => {
    // Store username and password to validate
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [missingInfoAlert, setMissingInfoAlert] = useState(false)
    const [invalidEmailAlert, setInvalidEmailAlert] = useState(false)

    const validateUofTEmail = (email) => {
        return email.includes('@mail.utoronto.ca')
    }

    // Method for when form is submitted
    const onSubmit = (e) => {
        e.preventDefault()
        if (!username || !password) {
            setMissingInfoAlert(true)
            return
        }
        if (!validateUofTEmail(username)) {
            setInvalidEmailAlert(true)
            return
        }

        // Call method to validate user credentials
        onFormSubmit({ username, password})

        // Reset fields
        setMissingInfoAlert(false)
        setInvalidEmailAlert(false)
        setUsername('')
        setPassword('')
    }

    return (
        <div className='login-container'>
            {/* Alerts only active when form submission reveals a problem */}
            {missingInfoAlert && <Alert severity="error">Please fill out both fields</Alert>}
            {invalidEmailAlert && <Alert severity="error">Please enter a valid UofT email</Alert>}

            <img className='login-logo' src="/course_pathway_logo.png" alt="Logo" />
            <div className='login-header'>
                <h1 style={{color: 'green'}}>Sign in</h1>
            </div>

            <form className='login-credentials' onSubmit={onSubmit}>
                <div className='form-control'>
                    <label>Email</label>
                    <input type='text' placeholder='your_email@mail.utoronto.ca' value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>

                <div className='form-control'>
                    <label>Password</label>
                    <input type='password' placeholder='*********' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <input className='btn btn-block' type='submit' value='Login'/>
            </form>
            
            {/* If user doesn't have account, they navigate to account creation page from within login page*/}
            <div className='login-create-account'>
                <footer>
                    Don't have an account? <Link to='/signup'>Sign up!</Link>
                 </footer>
            </div>
        </div>
    )
}
