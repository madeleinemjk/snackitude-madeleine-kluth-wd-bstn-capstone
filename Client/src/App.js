import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './components/Login/Login';
import SnackRequests from './components/SnackRequests/SnackRequests';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import {getToken, clearToken, isLoggedIn} from "./utils/auth";
import SnackRequest from "./components/SnackRequest/SnackRequest";
import Reviews from "./components/Reviews/Reviews";

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
      }).then(user => {
        this.setState({
          user: user,
          token: token,
          loggedIn: true
        })
      }).catch(error => {
        console.error(error);
        this.notLoggedIn();
      });
    }
  }

  handleLogin = () => {
    console.log('here');
    this.checkLogin();
  };

  notLoggedIn = () => {
    clearToken();

    this.setState({
      user: null,
      token: null,
      loggedIn: false
    })
  };

  handleLogout = () => {
    clearToken();
    this.checkLogin();
  };

  render() {
    return (<>
          <BrowserRouter>
            <div className="container">
                <Header logout={() => this.handleLogout()} />
                <Switch>
                  <Route path='/login' exact render={(routeProps) => <Login {...routeProps} handleLogin={() => this.handleLogin()} loggedIn={this.state.loggedIn} />} />
                  <Route path='/' exact render={(routeProps) => <SnackRequests {...routeProps} loggedIn={this.state.loggedIn} />} />
                  <Route path='/user/:id' exact render={(routeProps) => <Reviews {...routeProps} loggedIn={this.state.loggedIn} />} />
                  <Route path='/:id' exact render={(routeProps) => <SnackRequest {...routeProps} loggedIn={this.state.loggedIn} />} />
                </Switch>
                <Footer />
            </div>
          </BrowserRouter>
        </>
    )
  };
}

export default App;
