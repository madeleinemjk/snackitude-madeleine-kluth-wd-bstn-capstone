import React, { Component } from "react";
import "./SnackRequest.scss";
import axios from 'axios';
import {getToken} from "../../utils/auth";
import socketIOClient from "socket.io-client";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";

const API_URL = process.env.REACT_APP_BACKEND_URL;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

const getSnackRequestRoute = (id) => {
    return `${API_URL}/snack-requests/${id}`;
};

const getSnackRequestPickedUpRoute = (id) => {
    return `${API_URL}/snack-requests/${id}/picked-up`;
};

const getSnackRequestPaidUpRoute = (id) => {
    return `${API_URL}/snack-requests/${id}/paid-up`;
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
        console.log(process.env);
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
            if (res.status === 204) {
                toast.info('No snack request found, taking you to your requests');
                this.props.history.push('/requests');
            } else {
                this.setState({
                    snackRequest: res.data
                })
            }
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
        }).then(res => {
            console.log(res.data);
            toast.info('Successfully added message!');
        }).catch(err => {
            console.error(err);
            toast.error('Could not add message');
        });
    };

    pickedUp = () => {
        const token = getToken();

        axios.put(getSnackRequestPickedUpRoute(this.state.snackRequest.id), null, {
            headers: {
                "Authorization": token
            }
        }).then(res => {
            console.log(res.data);
            toast.info('Successfully marked snack request as picked up');
        }).catch(err => {
            console.error(err);
            toast.error('Could not mark snack request as picked up');
        });
    };

    paidUp = () => {
        const token = getToken();

        axios.put(getSnackRequestPaidUpRoute(this.state.snackRequest.id), null, {
            headers: {
                "Authorization": token
            }
        }).then(res => {
            console.log(res.data);
            toast.info('Successfully marked snack request as paid up');
        }).catch(err => {
            console.error(err);
            toast.error('Could not mark snack request as paid up');
        });
    };

    render() {
        return <div className="snack-request">
            <h1>Snack Request {this.state.snackRequest?.id}</h1>
            <p>Description: {this.state.snackRequest?.description}</p>
            <p>Budget: {this.state.snackRequest?.budget}</p>
            <p>Wait Time: {this.state.snackRequest?.maxWaitTime}</p>
            <p>Address: {this.state.snackRequest?.addressName}</p>
            <p>Picked Up: {this.state.snackRequest?.pickedUp ? 'Yes': 'No'}</p>
            <p>Paid Up: {this.state.snackRequest?.paidUp ? 'Yes': 'No'}</p>
            {this.state.snackRequest?.deliveringUser?.firstName ?
                <p>Delivered By: <Link to={`/user/${this.state.snackRequest?.deliveringUserId}`}>{this.state.snackRequest?.deliveringUser?.firstName}</Link> - from {this.state.snackRequest.fromAddressName}</p>
                : null}
            <p>Duration: {Math.ceil(this.state.snackRequest?.duration / 60)} min</p>
            <p>Distance: {(this.state.snackRequest?.distance / 1000)}km</p>
            <p>Requested By: <Link to={`/user/${this.state.snackRequest?.requestingUserId}`}>{this.state.snackRequest?.requestingUser?.firstName}</Link></p>
            {!this.state.snackRequest?.paidUp && this.state.snackRequest?.deliveringUserId === this.props.user?.id ? <button onClick={this.paidUp}>Paid up!</button> : null}
            {!this.state.snackRequest?.pickedUp && this.state.snackRequest?.requestingUserId === this.props.user?.id ? <button onClick={this.pickedUp}>Picked up!</button> : null}
            {this.props.user?.id === this.state.snackRequest?.deliveringUserId ?
                <div className="directions">
                    <h2>Directions</h2>
                    <iframe title="Delivery Directions"
                        width="450"
                        height="250"
                        frameBorder="0"
                        src={`https://www.google.com/maps/embed/v1/directions?key=${API_KEY}&origin=place_id:${this.state.snackRequest?.fromPlaceId}&destination=place_id:${this.state.snackRequest?.placeId}`} allowFullScreen>
                    </iframe>
                </div>
                : null}
            <h2>Messages</h2>
            {this.state.snackRequest?.messages?.length ? this.state.snackRequest?.messages?.map(message => {
                return <div className="message" key={message.id}>
                    <p className="message-content">{message?.message}</p>
                    <p className="message-sender">{message?.sendingUser?.firstName}</p>
                </div>
            }) : <p>There are no messages yet. You can send one below!</p>}
            <textarea aria-label="Message" name="message" id="message" placeholder="Enter message text" onChange={this.handleMessageChange} />
            <button onClick={this.handleMessageSubmit}>Send Message</button>
        </div>
    }
}

export default SnackRequest;