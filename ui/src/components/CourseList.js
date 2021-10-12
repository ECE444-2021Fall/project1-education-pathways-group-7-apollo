import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(code, title, desc) {
  return { code, title, desc };
}

const rows = [
  createData("ECE444", "Software Engineering", "This course lol"),
  createData("ECE568", "Computer Security", "foo"),
  createData("APS100", "Orientation to Engineering", "bar"),
  createData("CIV300", "Terrestrial Energy Systems", "foobar"),
];

const CourseList = (props) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Course Code</TableCell>
            <TableCell align="right">Title</TableCell>
            <TableCell align="right">&nbsp;Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.code}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.code}
              </TableCell>
              <TableCell align="right">{row.title}</TableCell>
              <TableCell align="right">{row.desc}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export {CourseList};