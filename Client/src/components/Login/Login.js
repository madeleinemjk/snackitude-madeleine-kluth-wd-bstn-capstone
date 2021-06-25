import React, { Component } from "react";
import "./Login.scss";
import axios from 'axios';
import {setToken} from '../../utils/auth';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const getLoginRoute = () => {
    return `${API_URL}/users/signin`;
};

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: null,
            password: null
        }
    }

    componentDidMount() {
        this.checkLogin();
    }

    componentDidUpdate() {
        this.checkLogin();
    }

    checkLogin = () => {
        if (this.props.loggedIn) {
            this.props.history.push('/');
        }
    }

    handleUsernameChange = (event) => {
        this.setState({
            username: event.target.value
        });
    };

    handlePasswordChange = (event) => {
        this.setState({
            password: event.target.value
        })
    };

    submitForm = (event) => {
        event.preventDefault();

        axios.post(getLoginRoute(), {
            username: this.state.username,
            password: this.state.password
        }).then(res => {
            const token = res.data.token;
            setToken(token);
            this.props.handleLogin();
        }).catch(e => {
            // TODO: Toast notification
            console.error('Invalid login, try again');
        });
    };

    render() {
        return <div className="login">
            <p>Login</p>
            <input type="text" placeholder="Enter username" onChange={this.handleUsernameChange}></input>
            <input type="text" placeholder="Enter password" onChange={this.handlePasswordChange}></input>
            <button onClick={this.submitForm}>Submit</button>
        </div>
    }
}

export default Login;