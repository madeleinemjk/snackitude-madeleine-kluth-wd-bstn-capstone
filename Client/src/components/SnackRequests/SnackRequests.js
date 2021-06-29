import React, { Component } from "react";
import "./SnackRequests.scss";
import axios from 'axios';
import {getToken} from "../../utils/auth";
import {toast} from 'react-toastify';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const getSnackRequestSearchRoute = () => {
    return `${API_URL}/snack-requests/search`;
};

const getLocationSearchRoute = () => {
    return `${API_URL}/locations/search`;
};

const getAcceptRequestRoute = (id) => {
    return `${API_URL}/snack-requests/${id}/accept`;
};

class SnackRequests extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: null,
            requests: null,
            addresses: null,
            radius: null,
            longitude: null,
            latitude: null,
            placeId: null,
            addressName: null
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

    handleRadiusInput = (event) => {
      event.preventDefault();
      this.setState({
          radius: event.target.value
      });
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
            toast.error('Unable to search locations');
        });
    };

    selectAddress = (address) => {
        const token = getToken();

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

        axios.get(getSnackRequestSearchRoute(), {
            params: {
                lng: address.geometry.location.lng,
                lat: address.geometry.location.lat,
                radius: this.state.radius
            },
            headers: {
                "Authorization": token
            }
        }).then(res => {
            if (res && res.data) {
                this.setState({
                    requests: res.data
                });
            }
        }).catch(err => {
            console.error(err);
            toast.error('Unable to search snack requests');
        });
    };

    acceptRequest = (request) => {
        const token = getToken();

        axios.put(getAcceptRequestRoute(request.id), {
            longitude: this.state.longitude,
            latitude: this.state.latitude,
            addressName: this.state.addressName,
            placeId: this.state.placeId,
            duration: request.duration,
            distance: request.distance
        }, {
            headers: {
                "Authorization": token
            }
        }).then(res => {
            if (res && res.data) {
                toast.info('Successfully accepted snack request');
                this.props.history.push(`/requests/${request.id}`);
            }
        }).catch(err => {
            console.error(err);
            toast.error('Unable to accept snack request');
        })
      console.log(request);
    };

    render() {
        return <div className="snack-requests">
            <h2>Search for Snack Requests</h2>
            <p>First things first, please enter your destination address in the box below</p>
            <div className="address-search">
                <input aria-label="Address" type="text" id="address" name="address" onChange={event => this.handleLocationSearchChange(event)} placeholder="Enter destination" />
                <input aria-label="Radius" type="number" id="radius" name="radius" placeholder="Enter radius (km)" onChange={this.handleRadiusInput} />
                <button onClick={this.searchLocations}>Search</button>
            </div>
            <div className="locations">
                <h2>Locations</h2>
                {this.state.addresses?.length ?
                    this.state.addresses?.map(address => <p key={address.place_id}>{address.name}, {address.formatted_address} - <button onClick={() => this.selectAddress(address)}>{this.state.placeId === address.place_id ? 'Selected' : 'Choose'}</button></p>) :
                    <p>Enter an address to see locations</p>
                }
            </div>
            <div className="requests">
                <h2>Snack Requests</h2>
                {this.state.requests?.length ?
                    <div className="table">
                        <div className="table-header">
                            <div className="col">Description</div>
                            <div className="col">Distance</div>
                            <div className="col">Duration</div>
                            <div className="col">Max Wait Time</div>
                            <div className="col">Budget</div>
                            <div className="col">Address Name</div>
                            <div className="col">Action</div>
                        </div>
                        <div className="table-body">
                        {this.state.requests.map(request => {
                           return <div className="table-row" key={request.id}>
                               <div className="col"><span className="col-header">Description: </span>{request.description}</div>
                               <div className="col"><span className="col-header">Distance: </span>{(request.distance / 1000)}km</div>
                               <div className="col"><span className="col-header">Duration: </span>{Math.ceil(request.duration / 60)} min</div>
                               <div className="col"><span className="col-header">Max Wait Time: </span>{request.maxWaitTime} min</div>
                               <div className="col"><span className="col-header">Budget: </span>£ {request.budget}</div>
                               <div className="col"><span className="col-header">Address Name: </span>{request.addressName}</div>
                               <div className="col">
                                   <button onClick={() => this.acceptRequest(request)}>Accept</button>
                               </div>
                           </div>
                        })}
                        </div>
                    </div> :
                    <p>{this.state.placeId ? 'No snack requests within the radius of your selected location' : 'Choose a location to see nearby requests'}</p>
                }
            </div>
        </div>
    }
}

export default SnackRequests;