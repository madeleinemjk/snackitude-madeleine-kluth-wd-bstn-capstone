import React, { Component } from 'react';
import axios from 'axios';
import {getToken} from "../../utils/auth";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const createRequestRoute = (id) => {
    return `${API_URL}/snack-request/${id}`;
};


export default class CreateRequest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            description: null,
            longitude: null,
            latitude: null,
            addressName: null,
            maxWaitTime: null,
            budget: null
        };
    }

    componentDidMount() {
        this.checkLogin();
        this.fetchData();
    }

    fetchData = () => {
        const snackRequestId = this.props.match.params.id;
        const token = getToken();

        axios.post(createRequestRoute(snackRequestId), {
            headers: {
                "Authorization": token
            }
        }).then(res => {
            this.setState({
                description: this.state.description,
                longitude: this.state.lng,
                latitude: this.state.lat,
                addressName: this.state.addressName,
                maxWaitTime: this.state.maxWaitTime,
                budget: this.state.budget
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
                <label for="addressName">Enter location:</label>
                <input type="text" id="addressName" placeholder="enter location" onChange={(event) => this.handleLocationInput(event)} />
                <br></br>
                <label for="description">Description:</label>
                <input type="text" id="description" placeholder="enter snack details" onChange={(event) => this.handleDescriptionInput(event)} />
                <br></br>
                <label for="maxWaitTime">Maximum wait time:</label>
                <input type="number" id="maxWaitTime" placeholder="enter wait time" onChange={(event) => this.handleTimeInput(event)} />
                <br></br>
                <label for="budget">Budget:</label>
                <input type="number" id="budget" placeholder="enter budget" onChange={(event) => this.handleBudgetInput(event)} />
                <br></br>
                <p>Remember to pay your deliverer their £2 transnacktion fee!</p>
                <button disabled onClick={this.submitForm}>Submit</button>
            </div>
        )
    }
}
