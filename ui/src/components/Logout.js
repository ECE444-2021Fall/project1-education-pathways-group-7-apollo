import LogoutIcon from '@mui/icons-material/Logout';

// On logout, clear out localstorage and refresh browser to take user back to login page
function logout(e) {
    e.preventDefault();
    localStorage.clear()
    window.location.reload()
    return false
}

function Logout() {
    return (
        <LogoutIcon onClick={logout} style={{"cursor": "pointer"}}/>
    )
}

export default Logout
