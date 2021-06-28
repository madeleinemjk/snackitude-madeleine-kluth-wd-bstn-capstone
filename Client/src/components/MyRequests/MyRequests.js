import React, { Component } from 'react';
import axios from 'axios';
import "./MyRequests.scss";
import {getToken} from "../../utils/auth";
import {Link} from "react-router-dom";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const getMyRequestsRoute = () => {
    return `${API_URL}/snack-requests/requesting`;
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
        const token = getToken();

        axios.get(getMyRequestsRoute(), {
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
            <div className="my-requests">
                <div class="top-row">
                    <h1>My Snack Requests</h1>
                    <Link to="/create"><button>Create Snack Request</button></Link>
                </div>
                {this.state.myRequests?.length ?
                    <div className="table">
                        <div className="table-header">
                            <div className="col">Description</div>
                            <div className="col">Max Wait Time</div>
                            <div className="col">Budget</div>
                            <div className="col">Address Name</div>
                            <div className="col">Action</div>
                        </div>
                        <div className="table-body">
                            {this.state.myRequests.map(request => {
                                return <div className="table-row" key={request.id}>
                                    <div className="col">{request.description}</div>
                                    <div className="col">{request.maxWaitTime}</div>
                                    <div className="col">{request.budget}</div>
                                    <div className="col">{request.addressName}</div>
                                    <div className="col">
                                        <Link to={`/requests/${request.id}`}><button>View</button></Link>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div> :
                    <p>You have not created any snack requests yet</p>
                }
            </div>
        )
    }
}
