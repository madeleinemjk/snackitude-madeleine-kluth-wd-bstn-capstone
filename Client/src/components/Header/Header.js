import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Header.scss';
import logo from '../../assets/logos/Snackitude_Free_Sample_By_Wix.jpeg';
import Login from '../Login/Login';
import Register from '../Register/Register';
import Logout from '../Logout/Logout';

export default class Header extends Component {
    render() {
        return (
            <header className="header">
                <Link to="/home" className="logo">
                    <img src={logo} alt="Snackitude logo" />
                </Link>
                <Link to="/logout" className="logout-link"><Logout /></Link>
                <Login />
                <Register />
            </header>
        )
    }
}
