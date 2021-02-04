import React from "react";
import Auth from "./pages/Auth.jsx";
import { Route, Switch } from "react-router-dom";
import Registr from "./pages/Registr.jsx";
import Home from "./pages/Home/Home.jsx";
import { connect } from "react-redux";
import socket from "./utils/socket";
import reduxActions from "./Redux/actions";
import reduxState from "./Redux/state";
import RegistrSuccess from "./pages/RegistrSuccess.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getUsersOnline = () =>{
      setInterval(() => {    
          socket.emit("client_get_online_users", this.props.userInit._id);
      }, 30000);
    
  }

  componentDidMount = () => {
    var data = JSON.parse(localStorage.getItem("initUser"));
    if (data && data.token && data.userInit._id) {
      this.props.startAuthUser(data.token, data.userInit._id, data.userInit);
      // this.getUsersOnline()
    }

    socket.on("server_send_online_users", (res) => {
      this.props.setUsersOnline(res);
      console.log(this.props.usersOnline);
    });

    socket.on("messages_update", (res) => {
      this.props.getMessages();
    });
    socket.on("dialogs_update", () => {
      this.props.getDialogs();
      console.log('диалог апдейт')
    });
    socket.on("update_read", (data) => {
      if (data === this.props.userInit._id) return;
      let cloneMess = [...this.props.messages];
      cloneMess.forEach((mess) => {
        if (mess.ownerId !== this.props.userInit._id && mess.readed !== true) {
          mess.readed = true;
        }
      });
      this.props.setMessages(cloneMess);
    });

    window.addEventListener("keydown", (e) => {
      if (e.keyCode === 13 && !this.props.showFindUserModal)
        this.props.sendMessage();
    });
  };

  render() {
    return (
      <div>
        {!this.props.isAuth ? (
          <Switch>
            <Route path="/" exact>
              {" "}
              <Auth />{" "}
            </Route>
            <Route path="/registr">
              {" "}
              <Registr />{" "}
            </Route>
            <Route path="/success/:hash">
              {" "}
              <RegistrSuccess />{" "}
            </Route>
          </Switch>
        ) : (
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>

            <Route path="/dialog/:dialogId" exact>
              <Home />
            </Route>
          </Switch>
        )}
      </div>
    );
  }
}

export default connect(reduxState, reduxActions)(App);
