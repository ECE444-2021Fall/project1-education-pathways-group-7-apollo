import * as React from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { CourseList } from "./CourseList";
import { CoursePlanner } from "./CoursePlanner";
import PersistentDrawerLeft from "./SidebarFilters";
import { ProgressBar } from "./ProgressBar";
import MajorCoursesDisplay from "./MajorCoursesDisplay";
import MinorCoursesDisplay from "./MinorCoursesDisplay";

function createData(code, title, fac, desc, avg, offerings, campus, prereqs) {
  return {
    code,
    title,
    fac,
    desc,
    avg,
    offerings,
    campus,
    prereqs,
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
const SearchAndCourse = ({ userInfo, majorCourses, minorsRequirements }) => {
  // This data will be populated from the fetch API
  const [shownCourses, setShownCourses] = React.useState([]);
  // Used to prevent duplicates
  const [addedCoursesMap, setAddedCoursesMap] = React.useState({});
  // The actual array used for rendering
  const [addedCourses, setAddedCourses] = React.useState([]);

  const deleteCourse = (currentCourse) => {
    setAddedCourses(currentCourse)
  }

  /*const [course, setCourses] = React.useState([])

  const deleteCourse = (course) => {
    setCourses(prev => {
      const newCourses = prev.filter(oldCourse => oldCourse !== course)
      return newCourses
    })
  }*/



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
          data[course].Term,
          data[course].Campus,
          data[course]["Pre-requisites"]
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
            <Grid item xs={6}>
              <CourseList
                shownCourses={shownCourses}
                addedCoursesMap={addedCoursesMap}
                setAddedCoursesMap={setAddedCoursesMap}
                addedCourses={addedCourses}
                setAddedCourses={setAddedCourses}
              />
            </Grid>
            <Grid item xs={6}>
              <CoursePlanner 
              addedCourses={addedCourses}
              deleteCourse={deleteCourse}
              />
            </Grid>
            <Grid item xs={6}>
              <ProgressBar
                userInfo={userInfo}
                addedCourses={addedCourses}
                majorCourses={majorCourses}
                minorsRequirements={minorsRequirements}
              />
            </Grid>
          </Grid>
          <Grid sx={{ paddingTop: "20px" }} container spacing={2}>
            <Grid item xs={3}>
              <MajorCoursesDisplay
                userInfo={userInfo}
                addedCourses={addedCourses}
                majorCourses={majorCourses}
              />
            </Grid>
            <Grid item xs={3}>
              <MinorCoursesDisplay
                userInfo={userInfo}
                addedCourses={addedCourses}
                minorsRequirements={minorsRequirements}
              />
            </Grid>
          </Grid>
        </Box>
      </MainContainer>

      <br />
    </>
  );
};

export { SearchAndCourse };