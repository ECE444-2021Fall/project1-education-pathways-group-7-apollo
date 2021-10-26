import { Typography, Card, LinearProgress } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

export const ProgressBar = () => {
    return (
        <div style={{paddingTop: "20px"}}>
            <Card variant="outlined" style={{width: "50vw", backgroundColor: "#f7f6f6", paddingLeft: "10px", borderRadius: "10px"}}>
                <Typography 
                    style={{fontFamily: 'Bodoni Moda',fontSize: "150%",textAlign: 'left',paddingBottom: '1vh',fontWeight: '500',color: 'black'}}
                    variant="h1" 
                    component="h2">
                        Degree Requirements Progress
                </Typography>
                <br/>
                <Typography 
                    style={{fontFamily: 'Bodoni Moda',fontSize: "120%",textAlign: 'left',paddingBottom: '1vh',fontWeight: '500',color: 'black'}}
                    variant="h1" 
                    component="h2">
                        Major A
                </Typography>
                <span style={{display: "flex"}}>
                    <LinearProgress variant="determinate" value={100} sx={{width: "80%", 
                        height:25, 
                        border:'1px solid', 
                        marginBottom: "15px",
                        borderRadius:"5px", 
                        backgroundColor:'white', 
                        '& .MuiLinearProgress-bar': {
                            backgroundColor:"#4ac1c3"
                        }}}/>
                    <CheckCircleOutlinedIcon sx={{color: "#4ac1c3", paddingLeft: "10px"}}/>
                </span>
                    
                <Typography 
                    style={{fontFamily: 'Bodoni Moda',fontSize: "120%",textAlign: 'left',paddingBottom: '1vh',fontWeight: '500',color: 'black'}}
                    variant="h1" 
                    component="h2">
                        Minor B
                </Typography>
                <LinearProgress variant="determinate" value={20} sx={{width: "80%", 
                    height:25, 
                    border:'1px solid', 
                    borderRadius:"5px",
                    marginBottom: "15px", 
                    backgroundColor:'white', 
                    '& .MuiLinearProgress-bar': {
                        backgroundColor:"#4ac1c3"
                    }}}/>
                <Typography 
                    style={{fontFamily: 'Bodoni Moda',fontSize: "120%",textAlign: 'left',paddingBottom: '1vh',fontWeight: '500',color: 'black'}}
                    variant="h1" 
                    component="h2">
                        Minor C
                </Typography>
                <LinearProgress variant="determinate" value={70} sx={{width: "80%", 
                    height:25, 
                    border:'1px solid', 
                    borderRadius:"5px",
                    marginBottom: "15px", 
                    backgroundColor:'white', 
                    '& .MuiLinearProgress-bar': {
                        backgroundColor:"#4ac1c3"
                    }}}/>
            </Card>
        </div>
    )
}
