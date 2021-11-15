import * as React from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { SearchBar } from "./SearchBar";
import { CourseList } from "./CourseList";
import { CoursePlanner } from "./CoursePlanner";
import PersistentDrawerLeft from "./SidebarFilters";
import { ProgressBar } from "./ProgressBar";
import MajorCoursesDisplay from "./MajorCoursesDisplay";
import MinorCoursesDisplay from "./MinorCoursesDisplay";

function createData(code, title, fac, desc, avg, offerings) {
  return {
    code,
    title,
    fac,
    desc,
    avg,
    offerings,
  };
}

const MainContainer = styled("div")({
  color: "darkslategray",
  backgroundColor: "aliceblue",
  padding: 8,
  borderRadius: 4,
  marginTop: 60,
});

// userID prop is Mongo's generated user ID
const SearchAndCourse = ({userInfo, majorCourses, minorsRequirements}) => {
  // This data will be populated from the fetch API
  const [shownCourses, setShownCourses] = React.useState([]);
  // Used to prevent duplicates
  const [addedCoursesMap, setAddedCoursesMap] = React.useState({});
  // The actual array used for rendering
  const [addedCourses, setAddedCourses] = React.useState([]);

  const fetchCourses = React.useCallback(async (query, year, campus, dept) => {
    if (year === "Any") {
      year = "";
    }
    if (campus === "Any") {
      campus = "";
    }
    const searchField = `?search_field=${query}&search_filters=`;
    const filters = `{"Campus" : "${campus}", "Course Level" : "${year}"}`;
    // Example: 127.0.0.1:5000/api/search/?search_field=software&search_filters={"Campus" : "St. George", "Course Level" : "4", "Department" : "Edward S. Rogers Sr. Dept. of Electrical %26 Computer Engin.", "Division" : "Faculty of Applied Science %26 Engineering", "Term": "2022 Winter" }
    console.log(searchField + filters);
    const { data } = await axios.get(
      `http://localhost:5000/api/search/${searchField}${filters}`
    );
    const rows = [];
    for (const course in data) {
      rows.push(
        createData(
          data[course].Code,
          data[course].Name,
          data[course].Department,
          data[course]["Course Description"],
          data[course]["Average Grade"],
          data[course].Term
        )
      );
    }
    setShownCourses(rows);
  });

  return (
    <>
      <PersistentDrawerLeft fetchCourses={fetchCourses} />
      <MainContainer>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <CourseList
                shownCourses={shownCourses}
                addedCoursesMap={addedCoursesMap}
                setAddedCoursesMap={setAddedCoursesMap}
                addedCourses={addedCourses}
                setAddedCourses={setAddedCourses}
              />
              <div>Added courses: {addedCourses}</div>
            </Grid>
            <CoursePlanner
              addedCourses={addedCourses}
            />
          </Grid>
        </Box>
      </MainContainer>
      <ProgressBar userInfo={userInfo} addedCourses={addedCourses} majorCourses={majorCourses} minorsRequirements={minorsRequirements}/>
      <br/>
      <span style={{display: "flex"}}>
        <MajorCoursesDisplay userInfo={userInfo} addedCourses={addedCourses} majorCourses={majorCourses}/>
        {/* I apologize for how whack the line of code below is. But hey, it worked*/}
        {'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}
        <MinorCoursesDisplay userInfo={userInfo} addedCourses={addedCourses} minorsRequirements={minorsRequirements}/>
      </span>
      
    </>
  );
};

export { SearchAndCourse };
