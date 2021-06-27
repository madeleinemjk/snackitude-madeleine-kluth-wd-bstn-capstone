import React, { Component } from 'react';
import axios from 'axios';
import {getToken} from "../../utils/auth";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const getMyDeliveriesRoute = (deliveringUserId) => {
    return `${API_URL}/delivering/${deliveringUserId}`;
};


export default class MyDeliveries extends Component {
    constructor(props) {
        super(props);

        this.state = {
            myDeliveries: null
        };
    }

    componentDidMount() {
        this.checkLogin();
        this.fetchData();
    }

    fetchData = () => {
        const userId = this.props.match.params.deliveringUserId;
        const token = getToken();

        axios.get(getMyDeliveriesRoute(userId), {
            headers: {
                "Authorization": token
            }
        }).then(res => {
            this.setState({
                myDeliveries: res.data
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