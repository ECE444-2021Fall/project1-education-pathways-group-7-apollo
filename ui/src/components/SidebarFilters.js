import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Tooltip from "@mui/material/Tooltip";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { SearchBar } from "./SearchBar";
import Logout from "./Logout";

const filters = ["Course Year", "Division/Department", "Campus"];

const defaultYears = [
  { key: "yearAny", label: "Any", value: "Any" },
  { key: "yearOne", label: "1", value: "1" },
  { key: "yearTwo", label: "2", value: "2" },
  { key: "yearThree", label: "3", value: "3" },
  { key: "yearFour", label: "4", value: "4" },
];

const defaultCampus = [
  { label: "Any", value: "Any" },
  { label: "Mississauga", value: "Mississauga" },
  { label: "Scarborough", value: "Scarborough" },
  { label: "St. George", value: "St. George" },
];

const defaultDept = [];

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft(props) {
  const { fetchCourses } = props;
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState(false);
  const [year, setYear] = React.useState("");
  const [campus, setCampus] = React.useState("");
  const [dept, setDept] = React.useState("");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleCampusChange = (event) => {
    setCampus(event.target.value);
  };

  const handleDeptChange = (event) => {
    setDept(event.target.value);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        style={{
          backgroundColor: "#4CC0C2",
          alignContent: "center",
        }}
        position="fixed"
        open={open}
      >
        <Toolbar>
          <Tooltip title="Search">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>
          <div style={{ marginLeft: "auto" }}>
            <Logout />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <header
            style={{
              position: "relative",
              fontWeight: "bold",
              width: "25vw",
              alignSelf: "left",
              color: "#36454F",
            }}
          >
            Filters
          </header>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem>
            <SearchBar setSearchInput={setSearchInput} />
          </ListItem>
          <ListItem>
            <FormControl variant="standard" sx={{ m: 1, width: "100%" }}>
              <InputLabel id="demo-simple-select-standard-label">
                Year
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={year}
                onChange={handleYearChange}
                label="Year"
              >
                {defaultYears.map((year) => {
                  return (
                    <MenuItem key={year.key} value={year.value}>
                      {year.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </ListItem>
          <ListItem>
            <FormControl variant="standard" sx={{ m: 1, width: "100%" }}>
              <InputLabel id="demo-simple-select-standard-label">
                Campus
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={campus}
                onChange={handleCampusChange}
                label="Campus"
              >
                {defaultCampus.map((campus) => {
                  return (
                    <MenuItem key={campus.key} value={campus.value}>
                      {campus.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </ListItem>
          <ListItem>
            <FormControl variant="standard" sx={{ m: 1, width: "100%" }}>
              <InputLabel id="demo-simple-select-standard-label">
                Division or Department
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={dept}
                onChange={handleDeptChange}
                label="Dept"
              >
                {defaultDept.map((dept) => {
                  return (
                    <MenuItem key={dept.key} value={dept.value}>
                      {dept.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </ListItem>
        </List>
        <Button
          style={{
            borderRadius: 5,
            width: "15vw",
            alignSelf: "center",
            backgroundColor: "#4ac1c3",
            fontSize: "80%",
            marginTop: "2vh",
            marginBottom: "2vh",
            fontWeight: "bold",
            paddingTop: "1vh",
            paddingBottom: "1vh",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          }}
          variant="contained"
          type="submit"
          className="btn btn-lg btn-primary btn-block"
          onClick={() => {
            fetchCourses(searchInput, year, campus, dept);
            handleDrawerClose();
          }}
        >
          Search!
        </Button>
      </Drawer>
    </Box>
  );
}
