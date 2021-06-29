import React, { Component } from 'react';
import axios from 'axios';
import "./CreateRequest.scss";
import {getToken} from "../../utils/auth";
import {toast} from "react-toastify";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const createRequestRoute = () => {
    return `${API_URL}/snack-requests/`;
};

const getLocationSearchRoute = () => {
    return `${API_URL}/locations/search`;
};

export default class CreateRequest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            description: null,
            longitude: null,
            latitude: null,
            placeId: null,
            searchText: null,
            addressName: null,
            maxWaitTime: null,
            budget: null,
            addresses: null
        };
    }

    componentDidMount() {
        this.checkLogin();
    }

    submitData = (event) => {
        event.preventDefault();
        const token = getToken();
        axios.post(createRequestRoute(), {
            description: this.state.description,
            longitude: this.state.longitude,
            latitude: this.state.latitude,
            addressName: this.state.addressName,
            budget: this.state.budget,
            placeId: this.state.placeId,
            maxWaitTime: this.state.maxWaitTime
        }, {
            headers: {
                "Authorization": token
            }
        }).then(res => {
            console.log(res);
            toast.info(`Successfully created snack request with id ${res.data.id}`);
            this.props.history.push(`/requests/${res.data.id}`);
        }).catch(err => {
            toast.error(`Could not create snack request`);
            console.error(err);
        });
    };

    handleLocationInput = (event) => {
        event.preventDefault();
        const searchText = event.target.value;
        this.setState({
            searchText: searchText
        });
    };

    handleDescriptionInput = (event) => {
        event.preventDefault();
        const description = event.target.value;
        this.setState({
            description: description
        });
    };

    handleTimeInput = (event) => {
        event.preventDefault();
        const time = event.target.value;
        this.setState({
            maxWaitTime: time
        });
    };

    handleBudgetInput = (event) => {
        event.preventDefault();
        const budget = event.target.value;
        this.setState({
            budget: budget
        });
    };

    searchLocations = (event) => {
        event.preventDefault();
        const token = getToken();

        if (!this.state.searchText)
            toast.warn('Please provide a search text');

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

    selectAddress = (event, address) => {
        event.preventDefault();
        const lat = address.geometry.location.lat;
        const lng = address.geometry.location.lng;
        const addressName = address.formatted_address;
        const name = address.name;
        const placeId = address.place_id;

        this.setState({
            longitude: lng,
            latitude: lat,
            addressName: name + ' ' + addressName,
            placeId: placeId
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
            <form className="create-request" onSubmit={this.submitData}>
                <h1>Create Snack Request</h1>
                <p>Start by entering a location below</p>
                <div className="address-search">
                    <input type="text" id="location" name="location" placeholder="Enter a location" onChange={(event) => this.handleLocationInput(event)} />
                    <button onClick={this.searchLocations}>Search</button>
                </div>

                <div className="locations">
                    <h2>Locations</h2>
                    {this.state.addresses?.length ?
                        this.state.addresses?.map(address => <p key={address.place_id}>{address.name}, {address.formatted_address} - <button onClick={(event) => this.selectAddress(event, address)}>{this.state.placeId === address.place_id ? 'Selected' : 'Choose'}</button></p>) :
                        <p>Enter an address to see locations</p>
                    }
                </div>

                <div className="snack-details">
                    <h2>Snack Details</h2>
                    <p>Enter the remaining details for your snack below</p>
                    <input type="text" aria-label="Description" id="description" name="description" placeholder="Enter snack description" onChange={(event) => this.handleDescriptionInput(event)} />
                    <input type="number" aria-label="Wait Time" id="maxWaitTime" name="maxWaitTime" placeholder="Enter wait time (min)" onChange={(event) => this.handleTimeInput(event)} />
                    <input type="number" aria-label="Budget" id="budget" placeholder="Enter budget (£)" onChange={(event) => this.handleBudgetInput(event)} />
                </div>

                <p>Remember to pay your deliverer their £2 transnacktion fee!</p>
                <button type="submit">Submit</button>
            </form>
        )
    }
}
