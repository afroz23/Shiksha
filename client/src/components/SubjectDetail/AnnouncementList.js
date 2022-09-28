import React,{useState} from 'react'
import {
  Avatar,
  List,
  ListItem,
  TextField,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import moment from "moment-timezone";
import WrappedButton from "../common/WrappedButton";
import { postAnnouncement } from "../../actions/facultyActions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import noAnnouncementLogo from "../../images/noAnnounements.svg";
const useStyles = makeStyles((theme) => ({
  item: {
    border: "1px solid lightgray",
    borderRadius: ".5rem",
    padding: "1rem",
    boxShadow: "1px 1px 3px gray",
    marginTop: "1rem",
    marginBottom: "1rem",
  },
  itemtop: {
    border: "1px solid lightgray",
    borderRadius: ".5rem .5rem 0rem 0rem",
    padding: "1rem",
    boxShadow: "1px 1px 3px gray",
    top: "10",
    marginTop: "1.5rem",
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

const AnnouncementList = (props) => {
  const [postInProgress, setPostInProgress] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const classes = useStyles();
  const user = useSelector((state) => state.user);
  const [announcements, setAnnouncements] = useState(props.announcements);
  const dispatch = useDispatch();

  let postNewAnouncement = () => {
    let data = {
      subjectId: props.subjectId,
      content: newAnnouncement,
    };
    if (newAnnouncement.length > 0) {
      setPostInProgress(true);
      dispatch(postAnnouncement(data))
        .then((result) => {
          let tempAnnouncements = JSON.parse(JSON.stringify(announcements));
          tempAnnouncements.unshift(result);
          setAnnouncements(tempAnnouncements);
          setPostInProgress(false);
          props.openSnackBar("Posted Announcement Succesfully!");
          setNewAnnouncement("");
        })
        .catch((err) => {
          setPostInProgress(false);
          props.openSnackBar(err.stack);
        });
    } else {
      setPostInProgress(false);
      props.openSnackBar("Cannot post an Empty String");
    }
  };

  return (
    <>
      <h2 style={{ textAlign: "center" }}>Announcements</h2>
      <List className={classes.list}>
        {user && user.isAdmin === true ? (
          <TextField
            value={newAnnouncement}
            fullWidth
            onChange={(event) => setNewAnnouncement(event.target.value)}
            multiline
            placeholder="Post an Announcement"
            minRows={2}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <WrappedButton
                  color="primary"
                  disabled={postInProgress}
                  name="Post"
                  onClick={postNewAnouncement}
                />
              ),
            }}
          />
        ) : null}
        {/* </ListItem> */}
        {announcements === undefined ||
        (announcements && announcements.length === 0) ? (
          <div>
            <img
              style={{ maxWidth: "35rem", maxHeight: "40rem" }}
              src={noAnnouncementLogo}
              alt="logo"
            />
          </div>
        ) : (
          announcements.map((ann) => {
            return (
              <>
                <ListItem className={classes.itemtop}>
                  <ListItemAvatar>
                    <Avatar alt="None" src="#" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={ann.postedBy}
                    secondary={
                      ann.postedOn
                        ? moment(new Date(ann.postedOn)).format("LLL")
                        : ""
                    }
                  />
                </ListItem>
                <ListItem className={classes.itembot}>
                  <ListItemText primary={ann.content} />
                </ListItem>
              </>
            );
          })
        )}
      </List>
    </>
  );
};

export default AnnouncementList
