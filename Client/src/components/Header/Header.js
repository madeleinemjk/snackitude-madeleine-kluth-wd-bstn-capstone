import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Header.scss';
import logo from '../../assets/logos/logo_screenshot_wix.png';

export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    logout = () => {
        this.props.logout();
    };

    render() {
        return (
            <header className={'header' + (this.props.loggedIn ? ' logged-in' : ' logged-out')}>
                <Link to="/" className="logo">
                    <img src={logo} alt="Snackitude logo" />
                </Link>
                {this.props.loggedIn ?
                    <div className="links">
                        <Link to="/"><button>Search</button></Link>
                        <Link to="/requests"><button>My Requests</button></Link>
                        <Link to="/deliveries"><button>My Deliveries</button></Link>
                        <button onClick={() => this.logout()}>Logout {this.props.user?.firstName}</button>
                    </div> : null}
            </header>
        );
    }
}
