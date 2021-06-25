import React, { Component } from 'react';
import Contact from '../Contact/Contact';
import { Link } from 'react-router-dom';

export default class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <Link to="/contact" className="footer-contact"><Contact /></Link>
            </div>
        )
    }
}
