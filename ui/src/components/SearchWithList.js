import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { SearchBar } from "./SearchBar";
import { CourseList } from "./CourseList";
import { CoursePlanner } from "./CoursePlanner";

const MainContainer = styled("div")({
  color: "darkslategray",
  backgroundColor: "aliceblue",
  padding: 8,
  borderRadius: 4,
});

const SearchAndCourse = () => {

  // This data will be used to send the request to the search api
  const [currentQuery, setCurrentQuery] = React.useState("");
  // This data will be populated from the fetch API
  const [shownCourses, setShownCourses] = React.useState();
  // Used to prevent duplicates
  const [addedCoursesMap, setAddedCoursesMap] = React.useState({});
  // The actual array used for rendering
  const [addedCourses, setAddedCourses] = React.useState([]);

  return (
    <MainContainer>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <SearchBar setCurrentQuery={setCurrentQuery} />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <CourseList
              addedCoursesMap={addedCoursesMap}
              setAddedCoursesMap={setAddedCoursesMap}
              addedCourses={addedCourses}
              setAddedCourses={setAddedCourses}
            />
            <div>The current query is {currentQuery}</div>
            <div>Added courses: {addedCourses}</div>
          </Grid>
          <CoursePlanner/>
        </Grid>
      </Box>
    </MainContainer>
  );
};

export { SearchAndCourse };
