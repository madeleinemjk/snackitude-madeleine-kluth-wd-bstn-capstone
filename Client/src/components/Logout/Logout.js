import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { logout } from '../../utils/utils';

export default class Logout extends Component {
    state = {
        navigate: false
    }

    handleLogout() {
        logout();
        this.setState({
            navigate: true
        })
    }

    render() {
        const { navigate } = this.state;

        if (navigate) {
            return <Redirect to="/home" push={true} />;
        }
        return (
            <div className="logout">
                <button className="logout__button" onClick={() => this.handleLogout()}>Logout</button>
            </div>
        )
    }
}
