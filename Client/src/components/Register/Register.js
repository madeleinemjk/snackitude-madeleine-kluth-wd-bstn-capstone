import React, { Component } from 'react';
import "./Register.scss";
import axios from 'axios';
import {setToken} from '../../utils/auth';

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
        if (event.handleConfirmPassword !== event.handlePasswordInput) {
            // button.disabled = true;
            console.error("Oops! Your passwords do not match.")
        }
    };

    submitForm = (event) => {
        event.preventDefault();

        axios.post(getRegisterRoute(), {
            username: this.state.username,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            password: this.state.password
        }).then(res => {
            const token = res.data.token;
            setToken(token);
            this.props.handleRegister();
        }).catch(e => {
            // TODO: Toast notification
            console.error('Invalid signup, try again');
        });
    };

    render() {
        return(
            <div className="register">
                <p>Register</p>
                <label for="username">Username:</label>
                <input type="text" id="username" placeholder="enter your email address here" onChange={(event) => this.handleEmailInput(event)} />
                <br></br>
                <label for="firstName">First Name:</label>
                <input type="text" id="firstName" placeholder="enter your first name here" onChange={(event) => this.handleFirstInput(event)} />
                <br></br>
                <label for="lastName">Last Name:</label>
                <input type="text" id="lastName" placeholder="enter your last name here" onChange={(event) => this.handleLastInput(event)} />
                <br></br>
                <label for="password">Password:</label>
                <input type="password" id="password" placeholder="open sesame" minLength="6" onChange={(event) => this.handlePasswordInput(event)} />
                <br></br>
                <label for="confirmPassword">Confirm Password:</label>
                <input type="password" id="confirmPassword" placeholder="nearly there" minlength="6" onChange={(event) => this.handleConfirmPassword(event)} />
                <button disabled onClick={this.submitForm}>Submit</button>
            </div>
        )
    }


}

export default Register;