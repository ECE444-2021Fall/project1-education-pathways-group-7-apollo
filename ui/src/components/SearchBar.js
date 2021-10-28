import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";

const SearchBar = ({ fetchCourses }) => {
  const [searchInput, setSearchInput] = React.useState("");
  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        options={top100Films.map((option) => option.title)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search input"
            InputProps={{
              ...params.InputProps,
              type: "search",
            }}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
        )}
      />
      <Button
        onClick={() => {
          fetchCourses(searchInput);
        }}
        variant="contained"
      >
        Go!
      </Button>
    </Stack>
  );
};

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { title: "ECE444" },
  { title: "APS100" },
  { title: "ECE244" },
];

export { SearchBar };
