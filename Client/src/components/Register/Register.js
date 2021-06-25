import React, { Component } from 'react'

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
            console.error("Oops! Your passwords do not match.")
        }
    }

    render() {
        return(
            <div className="register">
                <label for="username">Username:</label>
                <input type="text" id="username" placeholder="enter your email address here" onChange={(event) => this.handleEmailInput(event)} />
                <br></br>
                <label for="firsstName">First Name:</label>
                <input type="text" id="firstName" placeholder="enter your first name here" onChange={(event) => this.handleFirstInput(event)} />
                <br></br>
                <label for="lastName">Last Name:</label>
                <input type="text" id="lastName" placeholder="enter your last name here" onChange={(event) => this.handleLastInput(event)} />
                <br></br>
                <label for="password">Password:</label>
                <input type="password" id="password" placeholder="open sesame" onChange={(event) => this.handlePasswordInput(event)} />
                <br></br>
                <label for="confirmPassword">Confirm Password:</label>
                <input type="password" id="confirmPassword" placeholder="nearly there" onChange={(event) => this.handleConfirmPassword(event)} />
            </div>
        )
    }


}

export default Register;