import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { SearchBar } from "../components/SearchBar";
import { CourseList } from "../components/CourseList";

const MainContainer = styled("div")({
  color: "darkslategray",
  backgroundColor: "aliceblue",
  padding: 8,
  borderRadius: 4,
});

function Home() {
  const [currentQuery, setCurrentQuery] = React.useState("");
  const [shownCourses, setShownCourses] = React.useState();
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
            <CourseList />
            <div>The current query is {currentQuery}</div>
          </Grid>
        </Grid>
      </Box>
    </MainContainer>
  );
}

export default Home;
