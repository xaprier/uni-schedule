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
  const hours = Array.from({ length: 9 },(_,index) => index + 8); // Hours from 8:00 to 17:00
  const days = Object.keys(schedule); // List of days
  const [page,setPage] = useState(0); // Current day
  const [totalHours,setTotalHourse] = useState(0);
  const [lastCommitDate,setLastCommitDate] = useState(null);
  const [day,setDay] = useState(days[page]); // Name of the current day
  const [fetched,setFetched] = useState(0);
  const [initialLoad,setInitialLoad] = useState(true);

  const handleChangePage = (event,newPage) => {
    if (newPage === days.length) {
      newPage = 0; // Loop back to Monday
    }
    setPage(newPage);
    setDay(days[newPage]); // Update the current day name
  };

  useEffect(() => {
    if (initialLoad && days.length > 0) {
      const currentDayIndex = new Date().getDay();
      const adjustedIndex = (currentDayIndex + 6) % 7; // Monday = 0
      setPage(adjustedIndex);
      setDay(days[adjustedIndex]);
      setInitialLoad(false);
    }

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
        setFetched(-1);
        return;
      }
      setFetched(1);
    };

    fetchLastCommitDate();
  },[days,initialLoad]);

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
                  const classesWithHour = classes.filter((c) => c.time === hour) || {};
                  return classesWithHour.length > 0 ? (
                    classesWithHour.map((classDetail,index) => (
                      <TableRow 
                        sx={{
                          height: '80px',
                        }} 
                        key={ `${hour}-${index}` }
                      >
                        { index === 0 && (
                          <TableCell rowSpan={ classesWithHour.length }>
                            { hour }:00-{ hour }:50
                          </TableCell>
                        ) }
                        <TableCell sx={{backgroundColor: classDetail.attendanceRequired === false ? 'rgba(107, 22, 16, 0.6)' : 'inherit'}}>{ classDetail.courseCode || 'Empty' }</TableCell>
                        <TableCell sx={{backgroundColor: classDetail.attendanceRequired === false ? 'rgba(107, 22, 16, 0.6)' : 'inherit'}}>{ classDetail.teachingMethod || 'Empty' }</TableCell>
                        <TableCell sx={{backgroundColor: classDetail.attendanceRequired === false ? 'rgba(107, 22, 16, 0.6)' : 'inherit'}}>{ classDetail.courseName || 'Empty' }</TableCell>
                        <TableCell sx={{backgroundColor: classDetail.attendanceRequired === false ? 'rgba(107, 22, 16, 0.6)' : 'inherit'}}>{ classDetail.instructor || 'Empty' }</TableCell>
                        <TableCell sx={{backgroundColor: classDetail.attendanceRequired === false ? 'rgba(107, 22, 16, 0.6)' : 'inherit'}}>{ classDetail.place || 'Empty' }</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow sx={ { height: '80px' } } key={ hour }>
                      <TableCell>{ hour }:00-{ hour }:50</TableCell>
                      <TableCell colSpan={ 5 }>Empty</TableCell>
                    </TableRow>
                  );
                }) }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={ [] }
            component="div"
            count={ days.length + 1 } // Total number of days
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
            Last updated: {
              fetched === 1 && lastCommitDate ? new Date(lastCommitDate).toLocaleString() :
                fetched === 0 && !lastCommitDate ? 'Loading...' :
                  'API Rate limit exceeded for you'
            }
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
