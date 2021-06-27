import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Header.scss';
import logo from '../../assets/logos/logo_screenshot_wix.png';
import Login from '../Login/Login';
import Register from '../Register/Register';

export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    logout = () => {
        this.props.logout();
    };

    render() {
        return (
            <header className="header">
                <Link to="/" className="logo">
                    <img src={logo} alt="Snackitude logo" />
                </Link>
                <button onClick={() => this.logout()}>Logout</button>
                <Login />
                <Register />
            </header>
        )
    }
}
