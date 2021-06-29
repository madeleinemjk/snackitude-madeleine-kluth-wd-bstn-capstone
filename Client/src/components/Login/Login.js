import React, { Component } from "react";
import "./Login.scss";
import axios from 'axios';
import {setToken} from '../../utils/auth';
import {toast} from "react-toastify";
import {Link} from "react-router-dom";

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
            toast.error('Invalid login, try again');
            console.error(e);
        });
    };

    render() {
        return <form onSubmit={this.submitForm} className="login">
            <h2>Login</h2>
            <label for="username"></label>
            <input type="text" id="username" name="username" placeholder="Enter username" onChange={this.handleUsernameChange} />
            <label for="password"></label>
            <input type="password" id="password" name="password" placeholder="Enter password" onChange={this.handlePasswordChange} />
            <button type="submit">Submit</button>
            <p className="register-link">No Account? <Link to="/register">Get one now</Link></p>
        </form>
    }
}

export default Login;