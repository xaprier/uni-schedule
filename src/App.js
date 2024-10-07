import './App.css';
import program from "./program";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
} from "@mui/material";
import { useState } from "react";

import { ThemeProvider,createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App () {
  const hours = Array.from({ length: 10 },(_,index) => index + 8); // Hours from 8:00 to 17:00
  const days = Object.keys(program); // List of days
  const [page,setPage] = useState(0); // Current day
  const [day,setDay] = useState(days[page]); // Name of the current day

  const handleChangePage = (event,newPage) => {
    setPage(newPage);
    setDay(days[newPage]); // Update the current day name
  };

  return (
    <ThemeProvider theme={ darkTheme }>
      <CssBaseline />
      <div className="App">
        <header className="App-header">
          <h1>Schedule - { day }</h1>
          <TableContainer component={ Paper } sx={ { overflowX: 'auto' } }>
            <Table sx={ { minWidth: 600,width: '100%' } }>
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Course Code</TableCell>
                  <TableCell>Teaching Method</TableCell>
                  <TableCell>Course Name</TableCell>
                  <TableCell>Instructor</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { hours.map((hour) => {
                  const currentDay = days[page]; // Current day
                  const classes = program[currentDay] || []; // Classes for the current day
                  const classDetails = classes.find((d) => d.time === hour) || {}; // Class details for the current hour
                  return (
                    <TableRow key={ hour }>
                      <TableCell>{ hour }:00-{ hour }:50</TableCell>
                      <TableCell>{ classDetails.courseCode || 'Empty' }</TableCell>
                      <TableCell>{ classDetails.teachingMethod || 'Empty' }</TableCell>
                      <TableCell>{ classDetails.courseName || 'Empty' }</TableCell>
                      <TableCell>{ classDetails.instructor || 'Empty' }</TableCell>
                      <TableCell>{ classDetails.place || 'Empty' }</TableCell>
                    </TableRow>
                  );
                }) }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={ [] }
            component="div"
            count={ days.length } // Total number of days
            rowsPerPage={ 1 } // Show one day per page
            page={ page }
            onPageChange={ handleChangePage }
            sx={ {
              backgroundColor: '#1976d2',
              color: '#fff',
            } }
          />
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
