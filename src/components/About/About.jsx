import React from 'react'
import './About.css';

const copyUrl = async (url) => {
    try {
        await navigator.clipboard.writeText(url);
    } catch (error) {
        // Fallback for browsers that don't support Clipboard API
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = url;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
    }
};

const formatTime = (timestamp) => {
    const date = new Date(timestamp); // Convert to milliseconds
    // Now you can use the toDateString method
    const formattedTime = date.toDateString();
    return formattedTime;
};

function About(props) {
    return (
        <div>
            <div className="about-container">
                <div className="about-area">
                    {props.userData.about ? props.userData.about : 'I am a Thintry user!'}
                </div>
                <div className="static-area">
                    <div className="created">
                        <box-icon name='calendar-alt' type='solid' color='#6fbf7e' />&nbsp;
                        {formatTime(props.userData.created ? props.userData.created.timestamp : '')}
                    </div>
                    <div className="location">
                        <box-icon name='current-location' color='#6fbf7e' />&nbsp;
                        {props.userData.created ? `${props.userData.created.location.region}, ${props.userData.created.location.country}` : ''}
                    </div>
                    <div className="location" onClick={() => copyUrl('https://api.thintry.com/user/' + props.userData.username)}>
                        <box-icon name='link' color='orange' />&nbsp;Copy Url
                    </div>
                </div>
            </div>
            <div style={{ width: '100%', height: '60px' }}></div>
        </div>
    )
}

export default About
