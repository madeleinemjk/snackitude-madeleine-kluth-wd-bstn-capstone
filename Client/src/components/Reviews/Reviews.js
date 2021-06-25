import React, { Component } from "react";
import "./Reviews.scss";
import axios from 'axios';
import {getToken} from "../../utils/auth";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const getReviewsForUser = (id) => {
    return `${API_URL}/users/${id}/reviews`;
};

class Reviews extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reviews: null
        };
    }

    componentDidMount() {
        this.checkLogin();

        const userId = this.props.match.params.id;
        const token = getToken();

        axios.get(getReviewsForUser(userId), {
            headers: {
                "Authorization": token
            }
        }).then(res => {
            if (res && res.data) {
                this.setState({
                    reviews: res.data
                });
            }
        }).catch(err => {
            console.error(err);
        });
    }

    componentDidUpdate() {
        this.checkLogin();
    }

    checkLogin = () => {
        if (!this.props.loggedIn) {
            this.props.history.push('/login');
        }
    };

    render() {
        return <div className="reviews">
            {this.state.reviews?.map(review => <div key={review.id}>
                <p>Text: {review.content}</p>
                <p>Rating: {review.rating}</p>
            </div>)}
            // TODO: ADD CREATE REVIEW BOX HERE
        </div>
    }
}

export default Reviews;