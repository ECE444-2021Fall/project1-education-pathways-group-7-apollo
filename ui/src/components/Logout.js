import LogoutIcon from "@mui/icons-material/Logout";
import { Tooltip, IconButton } from "@mui/material";

// On logout, clear out localstorage and refresh browser to take user back to login page
function logout(e) {
  e.preventDefault();
  localStorage.clear();
  window.location.reload();
  return false;
}

function Logout() {
  return (
    <Tooltip title="Log Out">
      <IconButton>
        <LogoutIcon onClick={logout} style={{ cursor: "pointer" }} />
      </IconButton>
    </Tooltip>
  );
}

export default Logout;
