import React,{useState} from 'react'
import {
  Avatar,
  List,
  ListItem,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import WrappedButton from "../common/WrappedButton";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

import { TextField } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import assignmentImage from "../../images/assignment.png";
import MomentUtils from "@date-io/moment";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from "moment-timezone";
import * as facultyActions from "../../actions/facultyActions";

import EmptyAssignmentLogo from "../../images/noAssignment.svg";
const useStyles = makeStyles((theme) => ({
  item: {
    border: "1px solid lightgray",
    borderRadius: ".5rem",
    padding: "1rem",
    boxShadow: "1px 1px 3px gray",
    marginTop: "-1",
  },
  itemtop: {
    border: "1px solid lightgray",
    borderRadius: ".5rem .5rem 0rem 0rem",
    padding: "1rem",
    boxShadow: "1px 1px 3px gray",
    top: "10",
  },
  itembot: {
    border: "1px solid lightgray",
    borderRadius: "0rem 0rem .5rem .5rem",
    padding: "1rem",
    boxShadow: "1px 1px 3px gray",
  },
  list: {
    paddingTop: 0,
  },
}));

const AssignmentList = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [newAssignmentName, setNewAssignmentName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const [postingInProgress, setPostingInProgress] = useState(false);
  const classes = useStyles();
  const assignments = props.assignments;
  let postAssignment = () => {
    let data = {
      name: newAssignmentName,
      deadline: deadline,
      content: content,
      subjectId: props.subjectId,
    };
    setPostingInProgress(true);
    if (newAssignmentName.length > 0 && deadline !== "") {
      dispatch(facultyActions.postAssignment(data))
        .then((result) => {
          props.openSnackBar("Assignment Posted Successfully");
          setPostingInProgress(false);
          setOpen(false);
        })
        .catch((err) => {
          props.openSnackBar(err.stack);
          setPostingInProgress(false);
          setOpen(false);
        });
    } else {
      props.openSnackBar("Missing Fields!");
      setPostingInProgress(false);
    }
  };
  return (
    <>
      <List className={classes.list}>
        <h2 style={{ textAlign: "center" }}>Assignments</h2>
        {user && user.isAdmin === true ? (
          <Button onClick={() => setOpen(true)} color="primary">
            {" "}
            POST ASSIGNMENT{" "}
          </Button>
        ) : null}
        {(assignments === undefined || assignments) &&
        assignments.length === 0 ? (
          <div>
            <img
              style={{ maxWidth: "35rem", maxHeight: "40rem" }}
              src={EmptyAssignmentLogo}
              alt="logo"
            />
          </div>
        ) : (
          assignments.map((ann) => {
            return (
              <ListItem className={classes.item} style={{ marginTop: "1rem" }}>
                <ListItemAvatar>
                  <Avatar src={assignmentImage} />
                </ListItemAvatar>
                <Link to={`/assignment/${ann._id}`}>
                  <ListItemText
                    primary={`Pankaj Gupta posted a new Assignment: ${ann.name}`}
                    secondary={moment(new Date(ann.postedOn)).format("LLL")}
                  />
                </Link>
              </ListItem>
            );
          })
        )}
      </List>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setNewAssignmentName("");
          setDeadline("");
          setContent("");
        }}
      >
        <DialogTitle>POST ASSIGNMENT</DialogTitle>
        <DialogContent>
          <TextField
            value={newAssignmentName}
            type="text"
            fullWidth
            margin="dense"
            onChange={(event) => setNewAssignmentName(event.target.value)}
            variant="outlined"
            className={classes.formControl}
            label="Name of the Assignment"
          />
          <TextField
            minRows={3}
            value={content}
            multiline
            fullWidth
            margin="dense"
            onChange={(event) => setContent(event.target.value)}
            placeholder="Description of the Assignment"
            variant="outlined"
          />
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DateTimePicker
              disablePast
              autoOk
              minDate={moment().tz("US/Eastern")}
              ampm
              margin="dense"
              format="LLL"
              fullWidth
              id="scheduleDate"
              label="Deadline"
              inputVariant="outlined"
              value={
                deadline !== ""
                  ? moment(new Date(deadline)).format("LLL")
                  : null
              }
              onChange={(event) => {
                event !== ""
                  ? setDeadline(event.format("YYYY-MM-DDTHH:mm"))
                  : setDeadline("");
              }}
            />
          </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setNewAssignmentName("");
              setDeadline("");
              setContent("");
            }}
            color="secondary"
          >
            Cancel
          </Button>
          <WrappedButton
            name="post"
            disabled={postingInProgress}
            onClick={postAssignment}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AssignmentList
