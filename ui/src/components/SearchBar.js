import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";

const SearchBar = ({ setSearchInput }) => {
  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        freeSolo
        data-testid="course-search-bar"
        disableClearable
        options={autoCompleteOptions.map((option) => option.title)}
        renderInput={(params) => (
          <TextField
            {...params}
            data-testid="course-search-bar-input"
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
    </Stack>
  );
};

const autoCompleteOptions = [];

export { SearchBar };
