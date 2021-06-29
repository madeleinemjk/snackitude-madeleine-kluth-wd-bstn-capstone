import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

export default class Footer extends Component {
    render() {
        return (
            <p className="footer">
                What's popping? 
                <Link to="/contact" className="footer-contact"> Contact us</Link> to share your kernels of thought so we can butter ourselves!
            </p>
        )
    }
}
