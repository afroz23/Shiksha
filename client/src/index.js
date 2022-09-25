import React from 'react';
import { render } from 'react-dom';
import configureStore from './store/configureStore';
import initialState from './reducers/initialState';
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import { Provider } from "react-redux";
import {
  checkForLoggedInUser,
  getMyTeachingSubjects,
  getTeachingSchedule,
  getMySujects,
  getStudentSchedule,
  getUpcomingAssignments,
} from "./actions/userActions";
import { Route, HashRouter as Router } from "react-router-dom";
import App from "./components/App/App";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";

const store = configureStore(initialState);

const theme = createTheme({
  props: {
    MuiPaper: {
      elevation: 0,
      square: false,
      variant: "outlined",
    },
  },
  palette: {
    primary: { main: "#3A36DB" },
    text: { primary: "#555" },
  },
  typography: {
    fontFamily: [
      "Nunito Sans",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    useNextVariants: true,
  },
});

store.dispatch(checkForLoggedInUser()).then(user => {
  if (user.isAdmin) {
  store.dispatch(getTeachingSchedule()).then(() => {
    })
    store.dispatch(getMyTeachingSubjects()).then(() => {
    })
  } else {
    store.dispatch(getStudentSchedule()).then(() => {
    })
    store.dispatch(getMySujects()).then(() => {
    })
    store.dispatch(getUpcomingAssignments()).then(()=>{
    })
  }
}).catch(err => {
  console.log(err);
})

render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <Router>
        <Route path='/' component={App} />
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);

