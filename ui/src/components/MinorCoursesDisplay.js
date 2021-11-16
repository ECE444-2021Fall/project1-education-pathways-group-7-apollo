import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

function MinorCoursesDisplay({ userInfo, addedCourses, minorsRequirements }) {
  // Get the list of courses taken by user
  const coursesTaken = [];
  userInfo["coursesTaken"].forEach((element) => {
    coursesTaken.push(element.code);
  });

  // Combine courses taken with the added courses
  const takenPlusAdded = [...coursesTaken, ...addedCourses];

  // Create a set out of the above courses
  const userCoursesSet = new Set(takenPlusAdded);

  // This code only works since we're only doing 1 minor for now.
  const currentMinorRequirements = minorsRequirements[0];
  const requirementCredits = currentMinorRequirements["Requirement Credits"];
  const requirementCourseGroups = currentMinorRequirements["Requirements"];

  let numRequirementCredits = [];
  let correspondingCourseGroups = [];

  requirementCredits.forEach((group) => {
    let numCreditsForGroup = Object.keys(group);
    numRequirementCredits.push(numCreditsForGroup);
    const courseGroups = group[numCreditsForGroup];

    // Combine courses in courseGroups into one big list
    let courseGroupsForCreditRequirement = [];
    courseGroups.forEach((courseGroup) => {
      const coursesInCourseGroup = requirementCourseGroups[courseGroup];
      courseGroupsForCreditRequirement = [
        ...courseGroupsForCreditRequirement,
        ...coursesInCourseGroup,
      ];
    });

    correspondingCourseGroups.push(courseGroupsForCreditRequirement);
  });

  return (
    <List
      sx={{
        borderRadius: 2,
        width: "100%",
        border: "solid 1px",
        bgcolor: "background.paper",
        position: "relative",
        overflow: "auto",
        maxHeight: 500,
        "& ul": { padding: 0 },
      }}
      subheader={<li />}
    >
      <ListSubheader
        style={{
          fontSize: "large",
          fontWeight: "bold",
          textDecoration: "underline",
        }}
      >
        Minor Requirements
      </ListSubheader>
      {numRequirementCredits.map((numCreditsRequires, index) => (
        <li key={`section-${index}`}>
          <ul>
            <ListSubheader style={{ fontSize: "large", fontWeight: "bold" }}>
              {`${numCreditsRequires}`} Course(s) From:
            </ListSubheader>
            {correspondingCourseGroups[index].map((course) => (
              <ListItem key={`item-${numCreditsRequires}-${course}`}>
                <ListItemText primary={`${course}`} />
                {userCoursesSet.has(course) ? (
                  <CheckCircleOutlinedIcon
                    sx={{ color: "#4ac1c3", paddingLeft: "10px" }}
                  />
                ) : (
                  <></>
                )}
              </ListItem>
            ))}
          </ul>
        </li>
      ))}
    </List>
  );
}

export default MinorCoursesDisplay;
