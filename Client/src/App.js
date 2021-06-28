import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './components/Login/Login';
import SnackRequests from './components/SnackRequests/SnackRequests';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {getToken, clearToken, isLoggedIn} from "./utils/auth";
import SnackRequest from "./components/SnackRequest/SnackRequest";
import Reviews from "./components/Reviews/Reviews";
import MyRequests from "./components/MyRequests/MyRequests";
import MyDeliveries from "./components/MyDeliveries/MyDeliveries";
import CreateRequest from "./components/CreateRequest/CreateRequest";
import Register from "./components/Register/Register";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const getUserRoute = () => {
  return `${API_URL}/users/me`;
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      token: null,
      loggedIn: isLoggedIn()
    }
  }

  componentDidMount() {
    this.checkLogin();
  }

  checkLogin = () => {
    const token = getToken();

    if (!token) {
      this.notLoggedIn();
    } else {
      // GET on /users/me
      axios.get(getUserRoute(), {
        headers: {
          'Authorization': token
        }
      }).then(res => {
        this.setState({
          user: res.data,
          token: token,
          loggedIn: true
        });
      }).catch(error => {
        console.error(error);
        this.notLoggedIn();
      });
    }
  }

  handleLogin = () => {
    this.checkLogin();
  };

  notLoggedIn = () => {
    clearToken();

    this.setState({
      user: null,
      token: null,
      loggedIn: false
    });

    toast.info('You are not logged in!');
  };

  handleLogout = () => {
    clearToken();
    this.checkLogin();
  };

  render() {
    return (<>
          <BrowserRouter>
            <div className="container">
                <Header user={this.state.user} loggedIn={this.state.loggedIn} logout={() => this.handleLogout()} />
                <Switch>
                  <Route path='/login' exact render={(routeProps) => <Login {...routeProps} handleLogin={() => this.handleLogin()} loggedIn={this.state.loggedIn} />} />
                  <Route path='/register' exact render={(routeProps) => <Register {...routeProps} loggedIn={this.state.loggedIn} />} />
                  <Route path='/' exact render={(routeProps) => <SnackRequests {...routeProps} loggedIn={this.state.loggedIn} />} />
                  <Route path='/requests' exact render={(routeProps) => <MyRequests {...routeProps} loggedIn={this.state.loggedIn} />} />
                  <Route path='/create' exact render={(routeProps) => <CreateRequest {...routeProps} loggedIn={this.state.loggedIn} />} />
                  <Route path='/deliveries' exact render={(routeProps) => <MyDeliveries {...routeProps} loggedIn={this.state.loggedIn} />} />
                  <Route path='/user/:id' exact render={(routeProps) => <Reviews {...routeProps} loggedIn={this.state.loggedIn} />} />
                  <Route path='/requests/:id' exact render={(routeProps) => <SnackRequest {...routeProps} user={this.state.user} loggedIn={this.state.loggedIn} />} />
                </Switch>
                <Footer />
            </div>
            <ToastContainer />
          </BrowserRouter>
        </>
    )
  };
}

export default App;
