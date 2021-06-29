import React, { Component } from 'react';
import axios from 'axios';
import "./MyDeliveries.scss";
import {getToken} from "../../utils/auth";
import {Link} from "react-router-dom";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const getMyDeliveriesRoute = () => {
    return `${API_URL}/snack-requests/delivering`;
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
        const token = getToken();

        axios.get(getMyDeliveriesRoute(), {
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
            <div className="my-deliveries">
                <h1>My Snack Deliveries</h1>
                {this.state.myDeliveries?.length ?
                    <div className="table">
                        <div className="table-header">
                            <div className="col">Description</div>
                            <div className="col">Max Wait Time</div>
                            <div className="col">Budget</div>
                            <div className="col">Address Name</div>
                            <div className="col">Action</div>
                        </div>
                        <div className="table-body">
                            {this.state.myDeliveries.map(request => {
                                return <div className="table-row" key={request.id}>
                                    <div className="col"><span className="col-header">Description: </span>{request.description}</div>
                                    <div className="col"><span className="col-header">Max Wait Time: </span>{request.maxWaitTime} min</div>
                                    <div className="col"><span className="col-header">Budget: </span>£ {request.budget}</div>
                                    <div className="col"><span className="col-header">Address Name: </span>{request.addressName}</div>
                                    <div className="col">
                                        <Link to={`/requests/${request.id}`}><button>View</button></Link>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div> :
                    <p>You have not accepted any snack requests yet</p>
                }
            </div>
        )
    }
}