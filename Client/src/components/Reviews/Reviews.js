import React, { Component } from "react";
import "./Reviews.scss";
import axios from 'axios';
import {getToken} from "../../utils/auth";
import {toast} from "react-toastify";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const getReviewsForUser = (id) => {
    return `${API_URL}/users/${id}/reviews`;
};

const getAddReviewRoute = (id) => {
    return `${API_URL}/users/${id}/review`;
};

class Reviews extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reviews: null,
            reviewText: null,
            reviewRating: null
        };
    }

    componentDidMount() {
        this.checkLogin();
        this.fetchData();
    }

    fetchData = () => {
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

    handleReviewChange = (event) => {
        this.setState({
            reviewText: event.target.value
        });
    };

    handleRatingChange = (event) => {
        this.setState({
            reviewRating: event.target.value
        });
    };

    handleReviewSubmit = (event) => {
        event.preventDefault();
        const token = getToken();

        axios.post(getAddReviewRoute(this.props.match.params.id), {
            content: this.state.reviewText,
            rating: this.state.reviewRating
        }, {
            headers: {
                "Authorization": token
            }
        }).then(res => {
            console.log(res.data);
            toast.info('Successfully added review!');
            this.fetchData();
        }).catch(err => {
            toast.error('Could not add review');
        });
    };

    render() {
        return <div className="reviews">
            <h1>User Reviews</h1>
            {this.state.reviews?.map(review => <div className="review" key={review.id}>
                <p className="review-text">{review.content}</p>
                <p className="review-rating">Rating: {review.rating}</p>
            </div>)}
            <div className="add-review">
                <h2>Add a review</h2>
                <label for="review"></label>
                <textarea name="review" id="review" placeholder="Enter review text" onChange={this.handleReviewChange} />
                <label for="rating">Enter your rating between 0 and 5</label>
                <input min="0" max="5" type="number" name="rating" id="rating" onChange={this.handleRatingChange} />
                <button onClick={this.handleReviewSubmit}>Send Review</button>
            </div>
        </div>
    }
}

export default Reviews;