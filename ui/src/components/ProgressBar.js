import { Typography, Card } from '@mui/material';
import IndividualProgressBar from './IndividualProgressBar';

// Right now addedCourses comes from search component. In future it'll come from coursePlanner component when they save
// Also to-do: add support for minors (maybe multiple)
export const ProgressBar = ({userInfo, addedCourses, majorCourses, minorsRequirements}) => {
    // I've decided on 20 credits being needed to graduate since it's 2.5 credits for 8 sems
    const NUM_CREDITS_FOR_MAJOR = 20

    // Create set to hold all the majorCourses
    const coursesForMajor = new Set(majorCourses)

    // Running counter to calculate major credits
    let majorCredits = 0

    // Get the list of courses taken by user
    const coursesTaken = []
    userInfo["coursesTaken"].forEach(element => {
        coursesTaken.push(element.code)
    });

    // Combine courses taken with the added courses
    const takenPlusAdded = [...coursesTaken, ...addedCourses]

    // Now calculate degree progress resulting from all courses taken
    takenPlusAdded.forEach(element => {
        // Number of credits per course is 0.5 if H1 or else 1 (if Y1). Only 2 options
        var courseCredit = element.includes('H1') ? 0.5 : 1
        if (coursesForMajor.has(element)) {
            majorCredits += courseCredit
        }
    });

    // Calculate total major progress
    const majorProgress = Math.round((majorCredits / NUM_CREDITS_FOR_MAJOR) * 100)
    const majorName = userInfo["major"]
   

    // Now deal with the minors that the user is taking
    // Store the minor names, and progress amounts in a list
    const minorProgressInformation = []

    for(let i = 0; i < minorsRequirements.length; i++) {
        const currentMinorRequirements = minorsRequirements[i]

        const requirementCredits = currentMinorRequirements["Requirement Credits"]
        const requirementCourseGroups = currentMinorRequirements["Requirements"]

        let totalMinorCreditsRequired = 0
        let numberMinorCreditsFulfilled = 0

        // Check how much of each requirement group is satisfied
        requirementCredits.forEach(group => {
            let numCreditsForGroup = Object.keys(group)
            const courseGroups = group[numCreditsForGroup]

            // numCreditsForGroup is a string, so convert it to int
            totalMinorCreditsRequired += +numCreditsForGroup

            // Combine courses in courseGroups into one big set
            let courseGroupsForCreditRequirement = new Set()
            courseGroups.forEach(courseGroup => {
                const coursesInCourseGroup = requirementCourseGroups[courseGroup]
                coursesInCourseGroup.forEach(course => {
                    courseGroupsForCreditRequirement.add(course)
                }) 
            })
            // Now check whether coursesTaken and addedCourses fulfill this credit requirement group
            takenPlusAdded.forEach(course => {
                // We only consider a course to fulfill requirements if it is in the requirement list and the group still has
                // credits left to fill. Ie, if you only need 1 course from a group, taking extra courses wont count for your degree progress
                if(courseGroupsForCreditRequirement.has(course) && numCreditsForGroup > 0) {
                    // var courseCredit = course.includes("H1") ? 0.5 : 1
                    numberMinorCreditsFulfilled += 1 // Requirements are in numcourses not numCredits
                    numCreditsForGroup -= 1
                }
            }) 
        })

        // Now calculate minor progress
        const minorProgress = Math.round((numberMinorCreditsFulfilled / totalMinorCreditsRequired) * 100)
        const minorName = currentMinorRequirements["Name"]
        minorProgressInformation.push([minorName, minorProgress])
    }
    
    // Now, with all the progress information for minors, form each individual progress bar component
    const minorProgressBars = minorProgressInformation.map((props) => 
        <IndividualProgressBar type="Minor" name={props[0]} progressAmount={props[1]} />
    )
    
    return (
        <div style={{paddingTop: "20px"}}>
            <Card variant="outlined" style={{width: "50vw", backgroundColor: "#f7f6f6", paddingLeft: "10px", borderRadius: "10px"}}>
                <Typography 
                    style={{fontFamily: 'Bodoni Moda',fontSize: "150%",textAlign: 'left',paddingBottom: '1vh',fontWeight: '500',color: 'black'}}
                    variant="h1" 
                    component="h2">
                        Degree Requirements Progress
                </Typography>
                <IndividualProgressBar type="Major" name={majorName} progressAmount={majorProgress} />
                {minorProgressBars}
            </Card>
        </div>
    )
}
