import React, { Component } from 'react';
import './Contact.scss';

export default class Contact extends Component {
    render() {
        return (
            <section className="contact">
                <h2 className="contact__header">Contact Us</h2>
                <div className="contact__body">
                    <p className="contact__body-item">Email: <a className="contact__body-item--email" href="mailto:snackitude@pickmeup.co.uk">snackitude@pickmeup.co.uk</a></p>
                    <p className="contact__body-item">Our Mission Statement</p>
                    <p className="contact__body-item">Privacy & Cookies</p>
                    <p className="contact__body-item">Ⓒ 2021 Snackitude</p>
                </div>
            </section>
        )
    }
}
