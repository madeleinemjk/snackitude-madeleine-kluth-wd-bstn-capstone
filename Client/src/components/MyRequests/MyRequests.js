import React, { Component } from 'react';
import axios from 'axios';
import {getToken} from "../../utils/auth";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const getMyRequestsRoute = (requestingUserId) => {
    return `${API_URL}/requesting/${requestingUserId}`;
};

export default class MyRequests extends Component {
    constructor(props) {
        super(props);

        this.state = {
            myRequests: null
        };
    }

    componentDidMount() {
        this.checkLogin();
        this.fetchData();
    }

    fetchData = () => {
        const userId = this.props.match.params.requestingUserId;
        const token = getToken();

        axios.get(getMyRequestsRoute(userId), {
            headers: {
                "Authorization": token
            }
        }).then(res => {
            this.setState({
                myRequests: res.data
            })
        }).catch(err => {
            console.error(err);
        });
    };

    componentDidUpdate() {
        this.checkLogin();
    }

    checkLogin = () => {
        if (!this.props.loggedIn) {
            this.props.history.push('/login');
        }
    };

    render() {
        return (
            <div>
                
            </div>
        )
    }
}
