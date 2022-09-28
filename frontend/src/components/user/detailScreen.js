import {
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch , useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core'
import AnnouncementList from '../SubjectDetail/AnnouncementList'
import AssignmentList from '../SubjectDetail/AssignmentList'
import * as userActions from '../../actions/userActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { LinearProgress } from '@material-ui/core'
import { DateTimePicker , MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from '@date-io/moment'
import moment from 'moment-timezone';
import WrappedButton from '../common/WrappedButton'

import * as facultyActions from '../../actions/facultyActions';
import '../App/App.css';
const useStyles = makeStyles((theme) => ({
  root: {
    margin: '1.5rem',
  },
  banner: {
    height: 225,
    backgroundImage:
      "url('https://gstatic.com/classroom/themes/img_bookclub.jpg')",
    borderRadius: '.5rem',
    backgroundSize: 'cover',
    backgroundRepeat: 'none',
  },
  classname: {
    fontSize: '30px',
    color: 'white',
  },
  border: {
    border: '1px solid',
  },
  leftmenu: {
    flex: '1',
  },
  rightmenu: {
    flex: '1',
  },
}))

const DetailScreen = (props) => {
  const dispatch = useDispatch();
  const user = useSelector(state=>state.user);
  const [loadingScreen , setLoadingScreen] = useState(true);
  const { subjectId } = useParams();
  const classes = useStyles();
  const [assignments,setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [name,setName] = useState("");
  const [classCode , setClassCode] = useState("");
  const [timeSchedule , setTimeSchedule] = useState("");
  const [scheduleClassInProgress ,setScheduleClassInProgress] = useState(false);
  const [faculty , setFaculty] = useState([]);
  useEffect(()=>{
     userActions.getSubjectData(subjectId).then(data=>{
       setAnnouncements(data.announcements);
       setAssignments(data.assignments);
       setClassCode(data.classCode);
       setFaculty(data.faculty);
       setName(data.name);
       setLoadingScreen(false);
     }).catch(err=>{
       setLoadingScreen(false);
       props.openSnackBar(err.stack);
     })
  },[]);
  
  let schedule = () => {
    setScheduleClassInProgress(true);
    let data = {
      subjectId : subjectId,
      scheduledAt : timeSchedule,
      subjectName : name
    }
    if(timeSchedule !== ""){
      dispatch(facultyActions.postSchedule(data)).then(result=>{
        props.openSnackBar('Class has been scheduled at '+ moment(new Date(result.scheduledAt)).format('LLL') );
        setTimeSchedule("");
        setScheduleClassInProgress(false);
      }).catch(err=>{
        props.openSnackBar(err.stack);
        setScheduleClassInProgress(false);
      })
    }else{
      props.openSnackBar('Select Date to Schedule the class');
      setScheduleClassInProgress(false);
    }
  }

  if(loadingScreen === true){
    return (
      <div className="verticalCenterAligned">
        <h2>LOADING YOUR DATA</h2>
        <LinearProgress />
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <Container className={classes.banner}>
        <List>
          <ListItem>
            <ListItemText
              primary={<h1 style={{ color: 'white' }}>{name}</h1>}
              secondary={
                <h2 style={{ color: 'white' }}>{classCode}</h2>
              }
              className={classes.classname}
            />
          </ListItem>
        </List>
      </Container>
      {
        user && user.isAdmin && <div>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DateTimePicker 
             style={{margin : '1rem',width : '40%'}}
             disablePast
             autoOk
             minDate={moment().tz('US/Eastern')}
             ampm
             format="LLL"
             id="scheduleDate"
             label="Schedule Class"
             inputVariant="outlined"
             value={(timeSchedule !== "") ? moment(new Date(timeSchedule)).format('LLL') : null}
             onChange={(event)=> { event !== "" ? setTimeSchedule(event.format("YYYY-MM-DDTHH:mm")) :setTimeSchedule("")} }
          />
        </MuiPickersUtilsProvider>
        <WrappedButton style={{margin : '1rem' ,padding : '1rem'}} color="#3A36DB"  disabled={scheduleClassInProgress} onClick={schedule} name="SCHEDULE" />
        </div>
      }
      <Container style={{ display: 'flex', padding: '0', marginTop: '1.5rem' }}>
        <>
          <div className={classes.leftmenu}>
            <Container>
              <AssignmentList {...props} subjectId={subjectId} assignments={assignments}/>
            </Container>
          </div>
        </>

        <div className={classes.rightmenu}>
          <Container>
            <AnnouncementList {...props} subjectId={subjectId} announcements={announcements} />
          </Container>
        </div>
      </Container>
    </div>
  )
}

export default DetailScreen
