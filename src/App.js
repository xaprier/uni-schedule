import './App.css';
import schedule from "./schedule";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
  Typography,
  Link
} from "@mui/material";
import { useState,useEffect } from "react";
import { ThemeProvider,createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App () {
  const repoOwner = 'xaprier';
  const repoName = 'uni-schedule';
  const hours = Array.from({ length: 10 },(_,index) => index + 8); // Hours from 8:00 to 17:00
  const days = Object.keys(schedule); // List of days
  const [page,setPage] = useState(0); // Current day
  const [totalHours,setTotalHourse] = useState(0);
  const [lastCommitDate,setLastCommitDate] = useState(null);
  const [day,setDay] = useState(days[page]); // Name of the current day

  const handleChangePage = (event,newPage) => {
    setPage(newPage);
    setDay(days[newPage]); // Update the current day name
  };

  useEffect(() => {
    // Get the current day's index
    const currentDayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const adjustedIndex = (currentDayIndex + 6) % 7; // Adjust to make Monday = 0
    setPage(adjustedIndex);
    setDay(days[adjustedIndex]);

    const totalCount = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
      .reduce((total,day) => total + (schedule[day]?.length || 0),0);
    setTotalHourse(totalCount);

    const fetchLastCommitDate = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${repoOwner}/${repoName}/commits/main`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setLastCommitDate(data.commit.committer.date);
      } catch (error) {
        console.error('Error fetching commit date:',error);
      }
    };

    fetchLastCommitDate();
  },[page,day,days]); // Add dependency array to prevent infinite loop

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
                  const classes = schedule[currentDay] || []; // Classes for the current day
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
        <footer style={ { padding: '20px',textAlign: 'center',color: '#fff' } }>
          <Typography variant="body1">
            Last updated: { lastCommitDate ? new Date(lastCommitDate).toLocaleString() : 'Loading...' }
          </Typography>
          <Typography variant="body1">
            Total class hours this week: { totalHours }
          </Typography>
          <Link
            href={ `https://github.com/${repoOwner}/${repoName}` }
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            GitHub Repository
          </Link>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
