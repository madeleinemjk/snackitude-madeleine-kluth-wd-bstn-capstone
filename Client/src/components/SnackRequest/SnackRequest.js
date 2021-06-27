import React, { Component } from "react";
import "./SnackRequest.scss";
import axios from 'axios';
import {getToken} from "../../utils/auth";
import socketIOClient from "socket.io-client";
import {Link} from "react-router-dom";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const getSnackRequestRoute = (id) => {
    return `${API_URL}/snack-requests/${id}`;
};

const getSnackRequestMessageRoute = (id) => {
    return `${API_URL}/snack-requests/${id}/message`;
};

class SnackRequest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            snackRequest: null,
            messageText: null,
            socket: null
        };
    }

    componentDidMount() {
        this.checkLogin();
        this.fetchData();

        const socket = socketIOClient(API_URL);
        socket.on("Update", (update) => {
            if (parseInt(update.snackRequestId) === parseInt(this.state.snackRequest?.id)) {
                console.log('Updated');
                this.fetchData();
            }
        });
        this.setState({
            socket: socket
        });
    }

    fetchData = () => {
        const snackRequestId = this.props.match.params.id;
        const token = getToken();

        axios.get(getSnackRequestRoute(snackRequestId), {
            headers: {
                "Authorization": token
            }
        }).then(res => {
            this.setState({
                snackRequest: res.data
            })
        }).catch(err => {
            console.error(err);
        });
    };

    componentWillUnmount() {
        this.socket && this.socket.disconnect();
    }

    componentDidUpdate() {
        this.checkLogin();
    }

    checkLogin = () => {
        if (!this.props.loggedIn) {
            this.props.history.push('/login');
        }
    };

    handleMessageChange = (event) => {
        this.setState({
            messageText: event.target.value
        });
    };

    handleMessageSubmit = (event) => {
        event.preventDefault();
        const token = getToken();

        axios.post(getSnackRequestMessageRoute(this.state.snackRequest.id), {
            message: this.state.messageText
        }, {
            headers: {
                "Authorization": token
            }
        })
    };

    render() {
        return <div className="snack-request">
            <h1>Snack Request Page</h1>
            <p>Description: {this.state.snackRequest?.description}</p>
            <p>Budget: {this.state.snackRequest?.budget}</p>
            <p>MaxWaitTime: {this.state.snackRequest?.maxWaitTime}</p>
            <p>Address Name: {this.state.snackRequest?.addressName}</p>
            <p>Delivered By: {this.state.snackRequest?.deliveringUser?.firstName} -
                <Link to={`/user/${this.state.snackRequest?.deliveringUserId}`}>Review</Link>
            </p>
            <p>Requested By: {this.state.snackRequest?.requestingUser?.firstName} -
            <Link to={`/user/${this.state.snackRequest?.requestingUserId}`}>Review</Link>
            </p>
            <h2>Messages</h2>
            {this.state.snackRequest?.messages?.map(message => {
                return <p>{message?.message} - {message?.sendingUser?.firstName}</p>
            })};
            <textarea onChange={this.handleMessageChange}></textarea>
            <button onClick={this.handleMessageSubmit}>Add Message</button>
        </div>
    }
}

export default SnackRequest;