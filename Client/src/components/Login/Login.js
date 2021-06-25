import React, { Component } from 'react';
import { useHistory } from 'react-router-dom';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: null,
            password: null
        };
    };

    handleNameInput = (event) => {
        event.preventDefault();
        this.setState({username: event.target.value});
    };

    handlePasswordInput = (event) => {
        event.preventDefault();
        this.setState({password: event.target.value});
    };

    submit = (event) => {
        event.preventDefault();
        console.log(this.state);
    };

    render() {
        return(
            <div className="login">
                <label for="username">Username:</label>
                <input type="text" id="username" placeholder="enter your name here" onChange={(event) => this.handleNameInput(event)} />
                <br></br>
                <label for="password">Password:</label>
                <input type="password" id="password" placeholder="open sesame" onChange={(event) => this.handlePasswordInput(event)} />
                <br></br>
                <button onClick={this.submit} className="login__button">Happy snacking!</button>
            </div>
        )
    }


}

export default Login;