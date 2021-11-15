import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

function MajorCoursesDisplay({userInfo, addedCourses, majorCourses}) {
    // Get the list of courses taken by user
    const coursesTaken = []
    userInfo["coursesTaken"].forEach(element => {
        coursesTaken.push(element.code)
    });

    // Combine courses taken with the added courses
    const takenPlusAdded = [...coursesTaken, ...addedCourses]

    // Create a set out of the above courses
    const userCoursesSet = new Set(takenPlusAdded)

    return (
        <List
            sx={{
            width: '100%',
            maxWidth: 300,
            border: "solid 1px",
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'auto',
            maxHeight: 500,
            '& ul': { padding: 0 },
            }}
            subheader={<li />}
      >
        <ListSubheader style={{"fontSize": "large", "fontWeight": "bold", "textDecoration": "underline"}}>Your Major's Courses</ListSubheader>
            {majorCourses.map((course) => (
            <ListItem key={`item-${course}`}>
                <ListItemText primary={`${course}`} />
                {/* Show check mark beside courses that user has taken / have been added by them */}
                {userCoursesSet.has(course) ? <CheckCircleOutlinedIcon sx={{color: "#4ac1c3", paddingLeft: "10px"}}/> : <></>}
            </ListItem>
        ))}
      </List>
    )
}

export default MajorCoursesDisplay
