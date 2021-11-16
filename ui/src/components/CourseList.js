import Collapse from "@mui/material/Collapse";
import TableHead from "@mui/material/TableHead";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import AddIcon from "@mui/icons-material/Add";
import LastPageIcon from "@mui/icons-material/LastPage";
import { styled } from "@mui/material/styles";

const TableStyle = styled("div")({
  width: "100%",
});

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function Row(props) {
  const {
    row,
    addedCourses,
    setAddedCourses,
    addedCoursesMap,
    setAddedCoursesMap,
  } = props;
  const [open, setOpen] = React.useState(false);

  const addCourses = React.useCallback(
    (row) => {
      if (!addedCoursesMap.hasOwnProperty(row)) {
        const newCourses = { ...addedCoursesMap, [row]: "Dummy data" };
        setAddedCoursesMap(newCourses);
        const newCourseArray = [...addedCourses, row];
        setAddedCourses(newCourseArray);
      }
    },
    [addedCourses, setAddedCourses, addedCoursesMap, setAddedCoursesMap]
  );

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.code}
        </TableCell>
        <TableCell align="left">{row.title}</TableCell>
        <TableCell align="left">{row.fac}</TableCell>
        <TableCell>
          <IconButton
            aria-label="add-course"
            size="small"
            onClick={() => addCourses(row.code)}
          >
            <AddIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                aria-label="course-desc"
                variant="h6"
                gutterBottom
                component="div"
              >
                Description
              </Typography>
              <div>{row.desc}</div>
              <Table size="small" aria-label="advanced course info">
                <TableRow>
                  <TableCell>Course Average</TableCell>
                  <TableCell>Offerings</TableCell>
                  <TableCell>Campus</TableCell>
                  <TableCell>Pre-requisites</TableCell>
                </TableRow>
                <TableBody>
                  <TableRow>
                    <TableCell>{row.avg}</TableCell>
                    <TableCell>{row.offerings.join(", ")}</TableCell>
                    <TableCell>{row.campus}</TableCell>
                    <TableCell>{row.prereqs.join(", ")}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const CourseList = (props) => {
  const {
    setAddedCourses,
    addedCourses,
    addedCoursesMap,
    setAddedCoursesMap,
    shownCourses,
  } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - shownCourses.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableStyle>
      <div>
        <h1>Course List</h1>
      </div>
      {shownCourses.length > 0 ? (
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell align="left">Course Code</TableCell>
                <TableCell align="left">Title</TableCell>
                <TableCell align="left">Department</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? shownCourses.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : shownCourses
              ).map((row) => (
                <Row
                  key={row.code}
                  row={row}
                  addedCourses={addedCourses}
                  setAddedCourses={setAddedCourses}
                  addedCoursesMap={addedCoursesMap}
                  setAddedCoursesMap={setAddedCoursesMap}
                />
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={3}
                  count={shownCourses.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                  sx={{ overflow: "visible" }}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      ) : (
        <div>
          <h3>No courses to display. Try searching for courses from the top left icon!</h3>
        </div>
      )}
    </TableStyle>
  );
};

export { CourseList };
