import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import MakeRequest from './components/MakeRequest/MakeRequest';
import ViewRequests from './components/ViewRequests/ViewRequests';
import AcceptRequests from './components/AcceptRequests/AcceptRequests';
import Ratings from './components/Ratings/Ratings';
import Footer from './components/Footer/Footer';
import Logout from './components/Logout/Logout';


export default class App extends Component {
    render() {
        return (
            <>
                <div className="container">
                    <BrowserRouter>
                        <Header />
                        <Switch>
                            <Route path='/login' component={Login} />
                            <Route path='/register' component={Register} />
                            <Route path='/snackRequest' exact component={MakeRequest} />
                            <Route path='/snackRequests/search' exact component={ViewRequests} />
                            <Route path='/snackRequests/:id' render={routeProps => (<AcceptRequests {...routeProps} />)} />
                            <Route path='user/:id/review' render={routeProps => (<Ratings {...routeProps} />)} />
                            <Route path='/logout' component={Logout} />
                        </Switch>
                    </BrowserRouter>
                </div>
                <Footer />
            </>
        )
    }
}
