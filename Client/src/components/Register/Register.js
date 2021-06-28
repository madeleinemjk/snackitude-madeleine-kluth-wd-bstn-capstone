import React, { Component } from 'react';
import "./Register.scss";
import axios from 'axios';
import {toast} from "react-toastify";
import {Link} from "react-router-dom";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const getRegisterRoute = () => {
    return `${API_URL}/users/signup`;
};

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: null,
            firstName: null,
            lastName: null,
            password: null,
            confirmPassword: null
        };
    };

    handleEmailInput = (event) => {
        event.preventDefault();
        this.setState({username: event.target.value});
    };

    handleFirstInput = (event) => {
        event.preventDefault();
        this.setState({firstName: event.target.value});
    };

    handleLastInput = (event) => {
        event.preventDefault();
        this.setState({lastName: event.target.value});
    };

    handlePasswordInput = (event) => {
        event.preventDefault();
        this.setState({password: event.target.value});
    };

    handleConfirmPassword = (event) => {
        event.preventDefault();
        this.setState({confirmPassword: event.target.value});

    };

    submitForm = (event) => {
        event.preventDefault();

        axios.post(getRegisterRoute(), {
            username: this.state.username,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            password: this.state.password
        }).then(res => {
            console.log('potato');
            console.log(res);
            toast.info('Successfully signed up! Taking you to login');
            this.props.history.push('/login');
        }).catch(e => {
            console.error(e);
            toast.error('Unable to sign up, please try again');
        });
    };

    render() {
        return(
            <form className="register" onSubmit={this.submitForm}>
                <h1>Register</h1>
                <label for="username">Username:</label>
                <input type="text" id="username" placeholder="Email" onChange={(event) => this.handleEmailInput(event)} />
                <label for="firstName">First Name:</label>
                <input type="text" id="firstName" placeholder="First Name" onChange={(event) => this.handleFirstInput(event)} />
                <label for="lastName">Last Name:</label>
                <input type="text" id="lastName" placeholder="Last Name" onChange={(event) => this.handleLastInput(event)} />
                <label for="password">Password:</label>
                <input type="password" id="password" placeholder="Nearly there..." minLength="6" onChange={(event) => this.handlePasswordInput(event)} />
                <label for="confirmPassword">Confirm Password:</label>
                <input type="password" id="confirmPassword" placeholder="Open sesame!" minLength="6" onChange={(event) => this.handleConfirmPassword(event)} />
                {this.state.password && this.state.confirmPassword ? (this.state.password !== this.state.confirmPassword ? <p>Password and confirm password must match!</p> : <p>Passwords match!</p>) : null}
                <button disabled={this.state.password !== this.state.confirmPassword} type="submit">Submit</button>
                <p className="login-link">Got an account? <Link to="/login">Log in now</Link></p>
            </form>
        )
    }


}

export default Register;
