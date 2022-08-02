import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Container,
  TextField,
  ListItemText,
  List,
  ListItem,
} from '@material-ui/core'
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import FormLabel from '@material-ui/core/FormLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import { useSelector, useDispatch } from 'react-redux'
import Radio from '@material-ui/core/Radio'
import Paper from '@material-ui/core/Paper'
import React, { useState, useEffect } from 'react';
import { LinearProgress } from '@material-ui/core'
import moment from 'moment-timezone';
import { api } from '../../utilities'
import '../App/App.css';


const useStyles = makeStyles((theme) => ({
  root: {
    margin: '1.5rem',
  },
  banner: {
    backgroundColor: '#61cfe6',

    '&:hover': {
      boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
    },
  },
  classname: {
    fontSize: '30px',
    color: 'white',
  },
  pos: {
    color: 'red',
  },
  leftmenu: {
    flex: '1',
  },
  rightmenu: {
    flex: '.4',
  },
}))

const AssignmentDetailScreen = (props) => {
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [assign, setAssign] = useState({});
  const user = useSelector(state => state.user);
  const [assignedMarks, setAssignedMarks] = useState("");
  const [marksAlreadyAlloted , setAlreadySubmittedMarks] = useState("");
  const [link, setLink] = useState('')
  const [links, setLinks] = useState([]);
  const [clicked, setClicked] = useState('');
  const [marksAlloted  , setMarksAlloted] = useState("");
  const [assignmentAlreadySubmitted , setAssignmentAlreadySubmitted]  = useState(false);
  const [isSubmitted, setisSubmitted] = useState(false);
  const [studentId , setStudentId]  = useState("");
  const classes = useStyles();
  const { ann_id } = useParams();

  let allotMarks = ()=>{
    let data = {
      submittedBy : studentId,
      assignmentPostId : ann_id,
      marks : assignedMarks
    }
    if(assignedMarks.length > 0){
      fetch(api.BASE_URL + 'api/assignment/submit', {
        method: 'post',
        headers: {
          "Content-Type": "application/json",
          "AccessToken": localStorage.getItem('AccessToken')
        },
        body: JSON.stringify(data)
      }).then(function (response) {
        return response.json();
      }).then(data => {
        if (data.error) {
          props.openSnackBar(data.error);
        } else {
          props.openSnackBar('Assigned Successfully!');
        }
      })
    }else{
      props.openSnackBar('Missing Marks!');
    }
  }

  
  let submit = () => {
    let data = {
      submissionLink: link,
      assignmentPostId: ann_id
    };
    if (link.length > 0) {
      fetch(api.BASE_URL + 'api/submitAssignment', {
        method: 'post',
        headers: {
          "Content-Type": "application/json",
          "AccessToken": localStorage.getItem('AccessToken')
        },
        body: JSON.stringify(data)
      }).then(function (response) {
        return response.json();
      }).then(data => {
        if (data.error) {
          props.openSnackBar(data.error);
        } else {
          props.openSnackBar('Submitted Successfully!');
        }
      })
    } else {
      props.openSnackBar('Missing Submission URL');
    }
  }
  
  useEffect(() => {
    setLoadingScreen(true);
    if (!user.isAdmin) {
      fetch(api.BASE_URL + 'api/assignment/' + ann_id, {
        method: 'get',
        headers: {
          "Content-Type": "application/json",
          "AccessToken": localStorage.getItem('AccessToken')
        }
      }).then(function (response) {
        return response.json();
      }).then(data => {
        if (data.error) props.openSnackBar(data.error);
        else {
          setAssign(data);
        }
      }).catch(err => {
        props.openSnackBar(err.stack);
      })

      fetch(api.BASE_URL + 'api/getStudentAssignmentData/'+ann_id,{
        method :'get',
        headers: {
          "Content-Type": "application/json",
          "AccessToken": localStorage.getItem('AccessToken')
        }
      }).then(function (response) {
        return response.json();
      }).then(data=>{
        if(data.error) props.openSnackBar(data.error);
        else{
          if(data){
            setAssignmentAlreadySubmitted(true);
            setMarksAlloted(data.marksAlloted);
          }
      }
    });
    } else {
      fetch(api.BASE_URL + 'api/getAssignments/' + ann_id, {
        headers: {
          "Content-Type": "application/json",
          "AccessToken": localStorage.getItem('AccessToken')
        }
      }).then(function (response) {
        return response.json();
      }).then(data => {
        if (data.error) props.openSnackBar(data.error);
        else {
          setLinks(data);
        }
      }).catch(err => {
        props.openSnackBar(err.stack);
      })
    }
    setLoadingScreen(false);
  }, [])


  return (
      loadingScreen === true ? (<div className="verticalCenterAligned">
      <h2>LOADING YOUR DATA</h2>
      <LinearProgress />
    </div>) : <>
    {user.isAdmin ? (
      <Container
        style={{ display: 'flex', padding: '0', marginTop: '1.5rem' }}
      >
        <>
          <div className={classes.leftmenu}>
            <Typography variant="h3">Submmited Assignments</Typography>
            <List>
              {links.map((olink) => {
                return (
                  <Container
                    style={{
                      // display: 'flex',
                      flexDirection : 'row',
                      flexWrap : 'wrap'
                    }}
                  >
                    <Typography style={{ cursor: 'pointer' ,padding : '1rem' ,borderColor : 'black' , backgroundColor : '#F3F0D7' ,borderWidth : '5px',marginTop : '1rem',borderRadius : '15px',boxShadow : '2px'}}
                      onClick={() => {
                        setClicked(olink.submissionLink)
                        setStudentId(olink.submittedBy);
                        setAlreadySubmittedMarks(olink.marksAlloted);
                        setAssignedMarks(olink.marksAlloted)
                      }}
                    >
                      {olink.submittedName}
                      {/* <ListItem>
                        <ListItemText
                          primary={olink.submittedName}
                        ></ListItemText>
                      </ListItem> */}
                    </Typography>
                    <Container
                      style={{
                        padding: '0',
                        marginLeft: '100',
                        alignItems: 'end',
                        alignContent: 'end',
                      }}
                    >
                    </Container>
                  </Container>
                )
              })}
            </List>
          </div>
        </>

        <div className={classes.rightmenu}>
          <Container style={{ alignContent: 'center', alignItems: 'center' }}>
            <iframe
              src={
                !(clicked === '') ? clicked.replace('view', 'preview').replace('?usp=sharing', '') : ''
              }
              width='440'
              height='480'
              alignContent='center'
              style={{ marginLeft: '100' }}
            ></iframe>
            {
              clicked !== '' ? <div><TextField
              style={{ marginLeft: '10' }}
              value={assignedMarks}
              disabled={marksAlreadyAlloted === '' ? false : true}
              onChange={(event) => setAssignedMarks(event.target.value)}
            ></TextField>

            <Button onClick={allotMarks}>Submit</Button></div>  : null
            }
            
          </Container>
        </div>
      </Container>
    ) : (
      // <>
      //   <Box display='flex' flexDirection='row' bgcolor='background.paper'>
      //     <Box>
      //       {links.map((link) => {
      //         ;<Grid item>{link}</Grid>
      //       })}
      //     </Box>
      //     <Box bgcolor='grey.300'></Box>
      //   </Box>
      // </>
      <div className={classes.root}>
        {console.log('okok')}
        {console.log(assign)}
        <h2 style={{ marginTop: '10' }}>Assignment</h2>

        <Container>
          <Card className={classes.banner}>
            <CardContent>
              <Typography
                className={classes.title}
                color='textSecondary'
                gutterBottom
                component='p'
              >
                {moment(new Date(assign.postedOn)).format('LLL')}
              </Typography>
              <Typography variant='h4' component='h1'>
                {assign.name}
              </Typography>
              <Typography className={classes.pos} color='textSecondary'>
                Due: {moment(new Date(assign.deadline)).format('LLL')}
              </Typography>
              <br />
              <Typography variant='p' component='p'>
                {assign.content}
              </Typography>
              {
                assignmentAlreadySubmitted ? <Typography>
                    {
                      marksAlloted !== "" ? "Marks Awarded : " + marksAlloted : 'Checking in Progress!'
                    }
                </Typography> : null
              }
            </CardContent>
            <CardActions>
              <Container style={{ width: '1rem' }}></Container>
              {
                !assignmentAlreadySubmitted ? <div>
                <TextField
                  value={link}
                  onChange={(text) => setLink(text.target.value)}
                ></TextField>

                <Button
                  style={{ backgroundColor: 'black', color: 'white' }}
                  disabled={assignmentAlreadySubmitted}
                  onClick={submit}
                >
                  Submit
                </Button>
                </div> : null
              }
            </CardActions>
          </Card>
        </Container>
        <Container style={{ height: '100' }}></Container>
        {!isSubmitted ? (
          <></>
        ) : (
          <Container style={{ alignContent: 'center', alignItems: 'center' }}>
            <iframe
              src={link.replace('view', 'preview')}
              width='640'
              height='480'
              alignContent='center'
              style={{ marginLeft: '100' }}
            ></iframe>
          </Container>
        )}
      </div>
    )}
  </>    
  )
}

export default AssignmentDetailScreen
