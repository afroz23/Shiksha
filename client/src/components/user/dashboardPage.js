import React,{useEffect,useState} from 'react'
import { useSelector } from 'react-redux';
import Container from '@material-ui/core/Container'
import ClassesGrid from '../Home/classesGrid';
import MainCompHeader from '../Home/mainComponentHeader';
import { Drawer } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { useDispatch } from 'react-redux';
import moment from 'moment-timezone';
import ListItemText from '@material-ui/core/ListItemText';
import { LinearProgress } from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import * as userActions from '../../actions/userActions';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import '../App/App.css';

const drawerWidth = 350;
export const useStyles = makeStyles((theme) => ({
  hide: {
      display: 'none',
  },
  drawer: {
      width: drawerWidth,
      flexShrink: 0,
  },
  drawerPaper: {
      width: drawerWidth,
  },
  drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'center',
  },
  drawerHeaderText: {
    textAlign : 'center'
  },
  listItemHeader: {
      fontWeight: 'bold',
  },
  listItemTextField: {
      width: '300px'
  },
  assignmentText : {
    marginTop : '2rem',
    textAlign : 'center'
  }
}));

function HomeScreen(props){
    const dispatch = useDispatch();
    const classes = useStyles();
    const theme = useTheme();
    const [loading,setLoading] = useState(false);
    const state = useSelector(state=>state);
    let subjects = [];
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    if(state.user.isAdmin){
      subjects = state.facultySubjects;
    }
    else{
      subjects  = state.studentSubjects;
    }
    const schedule = state.schedule;
    const upcomingAssignments = state.upcomingAssignments;

    const handleDrawerOpen = () => {
      setDrawerOpen(true);
    };
  
    const handleDrawerClose = () => {
      setDrawerOpen(false);
    };

    // useEffect(()=>{
    //   setLoading(true);
    //   dispatch(userActions.checkForLoggedInUser()).then((response)=>{
    //     setLoading(false);
    //   }).catch(err=>{
    //     localStorage.removeItem('AccessToken');
    //   })
    // },[state.user]);
    // if(loading === true){
    //   return (
    //     <div className="verticalCenterAligned">
    //       <h2>LOADING YOUR DATA</h2>
    //       <LinearProgress />
    //     </div>
    //   )
    // }
  return (
    <div className="home">
      <Drawer 
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        style={{marginTop : '200'}}
        classes={{
          paper : classes.drawerPaper
        }}
        >
          <div className={classes.drawerHeader}>
            <Typography variant="h6" className={classes.drawerHeaderText}>
              My Schedule 
            </Typography>
            <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
          {
            schedule && schedule.map((oClass)=> (
              <ListItem key={oClass._id} style={{flexDirection : 'column', justifyContent : 'center' , alignItems : 'center',marginTop : '1rem',borderRadius : '1rem',marginLeft : '0.5rem' , marginRight : '0.5rem'}}>
                <ListItemText primary={oClass.subjectName} />
                {/* <ListItemText secondary={"Scheduled at: " +  moment(new Date(oClass.scheduledAt)).format('LLL') }/> */}
                <Typography>{moment(new Date(oClass.scheduledAt)).format('LLL')}</Typography>
              </ListItem>
            ))
          }
        </List>
        <Divider />
        <Typography variant="h6" className={classes.assignmentText}>
              My Upcoming Assignments
            </Typography>
            {
              upcomingAssignments === undefined || upcomingAssignments.length == 0 ? <Typography className={classes.assignmentText}>
                No Assignments at the Moment!
              </Typography> : (
                          <List>
                          {
                            upcomingAssignments && upcomingAssignments.map((oAsg)=>(
                              <ListItem key={oAsg._id} style={{flexDirection : 'column', justifyContent : 'center' , alignItems : 'center',marginTop : '1rem',borderRadius : '1rem',marginLeft : '0.5rem' , marginRight : '0.5rem'}}>
                              <ListItemText primary={oAsg.name} />
                              {/* <ListItemText secondary={"Scheduled at: " +  moment(new Date(oClass.scheduledAt)).format('LLL') }/> */}
                              <Typography>{"Deadline " + moment(new Date(oAsg.deadline)).format('LLL')}</Typography>
                            </ListItem>
                            ))
                          }
                        </List>
              )
            }
      </Drawer>
    <Container maxWidth={"xl"}>
        <br />
        <MainCompHeader handleDrawerOpen={handleDrawerOpen} />
        <ClassesGrid subjects={subjects} />
    </Container>
    </div>
  )
}

export default HomeScreen