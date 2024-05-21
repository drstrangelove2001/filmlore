/* 
This is the React component responsible for content in the About Us page.
*/

import React, { Component } from 'react';
import Lottie from "lottie-react";
import animationData from "../../public/assets/About.json";
import '../starwarsintro.css';

export default class About extends Component {
    render() {
        return (
            <div className="container text-center mt-5">
                <p className="page-title text-center filmlore-font">about us</p>
                <div className="d-flex justify-content-center filmlore-font">
                    <div style={{ color: '#c569b1' }}>
                        <div style={{ color: '#c569b1' }}>
                            {/* Renders a Lottie animation using the animationData prop */}
                            <Lottie animationData={animationData} style={{ width: "200px", height: "200px", margin: "auto" }} />
                        </div>
                    </div>

                </div>
                <div class="star-wars-intro">

                    <p class="intro-text">
                        not so long ago, in a galaxy not far far away...
                    </p>

                    <div class="main-content">

                        <div class="title-content">
                            <p class="content-body">
                                Welcome to filmLore, where movies meet emotions, and the magic of cinema comes alive. Whether you're in the mood for a heartwarming romance, an adrenaline-pumping action film, or a mind-bending thriller, filmLore is here to guide you. Join us on a cinematic journey where every film recommendation is tailored to your unique preference. Immerse yourself in a world of cinematic wonder, where each movie is a story waiting to be told and an experience waiting to be shared. Explore our curated selection and let your movie adventure begin!
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

