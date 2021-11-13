import { Typography, LinearProgress } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

// type = Major or Minor, name = Major/Minor name, progressAmount = value between 0 -> 100
function IndividualProgressBar({type, name, progressAmount}) {
    return (
        <>
            <br/>
           <Typography 
                style={{fontFamily: 'Bodoni Moda',fontSize: "120%",textAlign: 'left',paddingBottom: '1vh',fontWeight: '500',color: 'black'}}
                variant="h1" 
                component="h2">
                    {type}: {name}
            </Typography>
            <span style={{display: "flex"}}>
                <LinearProgress variant="determinate" value={progressAmount} sx={{width: "80%", 
                    height:25, 
                    border:'1px solid', 
                    marginBottom: "15px",
                    borderRadius:"5px", 
                    backgroundColor:'white', 
                    '& .MuiLinearProgress-bar': {
                        backgroundColor:"#4ac1c3"
                    }}}/>
                {/* Conditionally show a check mark if the progress requirement is completely done */}
                {progressAmount === 100 ? <CheckCircleOutlinedIcon sx={{color: "#4ac1c3", paddingLeft: "10px"}}/> : <></>}
            </span> 
        </>
    )
}

export default IndividualProgressBar
