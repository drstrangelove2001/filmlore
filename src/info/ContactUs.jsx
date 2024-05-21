/* 
This is the React component responsible for content inside the Contact Us page.
*/

import React, { Component } from 'react';
import Lottie from "lottie-react";
import animationData from "../../public/assets/contact.json";
export default class ContactUs extends Component {
    render() {
        return (
            <div className="container text-center mt-5">
                <p className="text-center filmlore-font" style={{ fontSize: '40px' }}>got questions? we've got answers! </p>
                <p className="text-center filmlore-font" style={{ fontSize: '30px' }}>reach out and let us assist you!</p>
                <div className="d-flex justify-content-center filmlore-font">
                    <div className="col-md-4" style={{ color: '#c569b1', marginRight: '0', marginTop: '180px' }}>
                        <div style={{ textDecoration: 'underline' }}><h4>contact us</h4></div>
                        <div style={{ color: '#c569b1' }}>
                            <h5>email: contact@filmlore.com</h5>
                            <h5>phone: +65 12345678</h5>
                            <h5>address: 123 Corporation Road,Woodlands,Singapore</h5>
                        </div>
                    </div>
                    {/* Renders a Lottie animation using the animationData prop */}
                    <Lottie animationData={animationData} style={{ width: "500px", height: "500px" }} />
                </div>
            </div>

        );
    }
}