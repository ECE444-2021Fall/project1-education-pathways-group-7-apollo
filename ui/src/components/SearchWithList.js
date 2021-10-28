import * as React from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { SearchBar } from "./SearchBar";
import { CourseList } from "./CourseList";

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
});

const SearchAndCourse = () => {
  // This data will be used to send the request to the search api
  const [currentQuery, setCurrentQuery] = React.useState("");
  // This data will be populated from the fetch API
  const [shownCourses, setShownCourses] = React.useState([]);
  // Used to prevent duplicates
  const [addedCoursesMap, setAddedCoursesMap] = React.useState({});
  // The actual array used for rendering
  const [addedCourses, setAddedCourses] = React.useState([]);

  React.useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get(
        "http://localhost:5000/api/all_courses_code"
      );
      const rows = [];
      for (const course in data) {
        rows.push(
          createData(
            course,
            data[course].Name,
            data[course].Department,
            data[course]["Course Description"],
            data[course]["Average Grade"],
            data[course].Term
          )
        );
      }
      setShownCourses(rows);
    };
    fetch();
  }, [currentQuery]);

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
              shownCourses={shownCourses}
              addedCoursesMap={addedCoursesMap}
              setAddedCoursesMap={setAddedCoursesMap}
              addedCourses={addedCourses}
              setAddedCourses={setAddedCourses}
            />
            <div>The current query is {currentQuery}</div>
            <div>Added courses: {addedCourses}</div>
          </Grid>
        </Grid>
      </Box>
    </MainContainer>
  );
};

export { SearchAndCourse };
