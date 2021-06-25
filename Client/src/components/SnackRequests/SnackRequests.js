import React, { Component } from "react";
import "./SnackRequests.scss";
import axios from 'axios';
import {getToken} from "../../utils/auth";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const getSnackRequestSearchRoute = () => {
    return `${API_URL}/snack-requests/search`;
};

const getLocationSearchRoute = () => {
    return `${API_URL}/locations/search`;
};

class SnackRequests extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: null,
            requests: null,
            addresses: null
        };
    }

    componentDidMount() {
        this.checkLogin();
    }

    componentDidUpdate() {
        this.checkLogin();
    }

    checkLogin = () => {
        if (!this.props.loggedIn) {
            this.props.history.push('/login');
        }
    };

    handleLocationSearchChange = (event) => {
        event.preventDefault();
        this.setState({
            searchText: event.target.value
        });
    };

    searchLocations = (event) => {
        event.preventDefault();
        const token = getToken();

        axios.get(getLocationSearchRoute(), {
            headers: {
                "Authorization": token
            },
            params: {
                searchText: this.state.searchText
            }
        }).then(res => {
            if (res && res.data) {
                this.setState({
                    addresses: res.data
                });
            }
        }).catch(err => {
            console.error(err);
        });
    };

    selectAddress = (address) => {
        const token = getToken();

        axios.get(getSnackRequestSearchRoute(), {
            params: {
                lng: address.geometry.location.lng,
                lat: address.geometry.location.lat,
                radius: 5 // TODO: Make an input for this
            },
            headers: {
                "Authorization": token
            }
        }).then(res => {
            if (res && res.data) {
                this.setState({
                    requests: res.data
                })
            }
        }).catch(err => {
            console.error(err);
        });
    };

    render() {
        return <div className="snack-requests">
            <input type="text" onChange={event => this.handleLocationSearchChange(event)} placeholder="Enter the address you're going to" />
            <button onClick={this.searchLocations}>Search</button>
            <p>Requests</p>
            <h2>Locations</h2>
            {this.state.addresses?.map(address => <p>{address.formatted_address} - <a onClick={() => this.selectAddress(address)}>Select</a></p>)}
            <h2>Snack Requests</h2>
            {this.state.requests?.map(request => <p>{request.description} - {request.distance / 1000}km away</p>)}
        </div>
    }
}

export default SnackRequests;