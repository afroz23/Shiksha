import React from "react";
import { Route } from "react-router-dom";
import { LinearProgress } from "@material-ui/core";
import { useSelector } from "react-redux";
import LoginPage from "../user/LoginPage";
import SignUpPage from "../user/SignUpPage";
import DashboardPage from "../user/dashboardPage";
import CustomSnackBar from "../common/SnackBar";
import Header from "../Header/header";
import { Container } from "@material-ui/core";
import DetailScreen from "../user/detailScreen";
import AssignmentDetailScreen from "../user/assignmentDetailScreen";
import Home from "../user/home";
import "./App.css";

function App(props) {
  const oSnackBar = React.createRef();

  let openSnackBar = (message) => {
    if (oSnackBar.current) {
      oSnackBar.current.openSnackBar(message);
    }
  };

  const checkingForLoggedinUser = useSelector(
    (state) => state.checkingForLoggedinUser
  );
  const userState = useSelector((state) => state.user);
  if (checkingForLoggedinUser === true) {
    return (
      <div className="verticalCenterAligned">
        <h2>CHECKING YOUR SESSION</h2>
        <LinearProgress />
      </div>
    );
  }

  return (
    <div>
      {userState._id ? (
        <Header
          history={props.history}
          theme={props.theme}
          openSnackBar={openSnackBar}
          {...props}
        />
      ) : null}
      <Container>
        <Route
          exact
          path="/"
          render={(props) => {
            if (userState._id) {
              props.history.push("/home");
            } else {
              // return <
              return <Home openSnackBar={openSnackBar} {...props} />;
            }
          }}
        />
        <Route
          exact
          path="/login"
          render={(props) => (
            <LoginPage openSnackBar={openSnackBar} {...props} />
          )}
        />
        <Route
          exact
          path="/signup"
          render={(props) => (
            <SignUpPage openSnackBar={openSnackBar} {...props} />
          )}
        />
        <Route
          exact
          path="/home"
          render={(props) => (
            <DashboardPage openSnackBar={openSnackBar} {...props} />
          )}
        />
        <Route
          exact
          path="/subject/:subjectId"
          render={(props) => (
            <DetailScreen openSnackBar={openSnackBar} {...props} />
          )}
        />
        <Route
          exact
          path="/assignment/:ann_id"
          render={(props) => (
            <AssignmentDetailScreen openSnackBar={openSnackBar} {...props} />
          )}
        />
        <CustomSnackBar ref={oSnackBar} />
      </Container>
    </div>
  );
}

export default App;
