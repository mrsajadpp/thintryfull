import React from 'react';
import './Loading.css';
import thintryImage from './logo.png'; // Replace with actual image path

function Loading() {
    return (
        <div>
            <div className="loader">
                <div className="text-container">
                    <div className="fade-effect"></div>
                    <img src={thintryImage} alt="Thintry" className="thintry-image" />
                </div>
            </div>
        </div>
    );
}

export default Loading;
