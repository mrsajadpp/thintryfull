import { React, useEffect, useState, Suspense, lazy } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import './Settings.css';

function Settings(props) {
    const navigate = useNavigate();

    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
    }

    function delete_cookie(name) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    let [userData,addData] = useState({})

    useEffect(() => {
        // Check if the user is already logged in using the cookie
        let userData = getUserDataFromCookie();
        if (!userData) {
            navigate("/auth/login");
            return; // No need to continue checking if already logged in
        }
        addData(userData);
    }, [navigate]);

    function getUserDataFromCookie() {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('userData='));

        if (cookieValue) {
            const valuePair = cookieValue.split('=');
            if (valuePair.length === 2) {
                return JSON.parse(decodeURIComponent(valuePair[1]));
            }
        }
        return null;
    }

    useEffect(() => {
        const defaultTitle = "Thintry - Microblog";
        const updatedTitle = props.title ? `${props.title} - Thintry` : defaultTitle;
        document.title = updatedTitle;

        const metaDescription = props.description ? props.description : "Welcome to Thintry, a microblogging platform.";
        const metaKeywords = props.keywords ? `${props.keywords}, microblog, Thintry, social media` : "microblog, Thintry, social media";

        const metaDescriptionTag = document.querySelector('meta[name="description"]');
        if (metaDescriptionTag) {
            metaDescriptionTag.content = metaDescription;
        }

        const metaKeywordsTag = document.querySelector('meta[name="keywords"]');
        if (metaKeywordsTag) {
            metaKeywordsTag.content = metaKeywords;
        }
    }, [props.title, props.description, props.keywords]);
    const location = useLocation();

    const isPageActive = (path) => {
        return location.pathname === path;
    };

    function composeEmail() {
        var toAddress = "help@thintry.com";
        var subject = "New bug report!";

        var postData = {
            userId: userData._id,
            username: userData.username,
            email: userData.email,
            verified: userData.verified
        };

        var body = JSON.stringify(postData, null, 2); // Converts the postData object to a JSON string with formatting

        var mailtoLink = "mailto:" + encodeURIComponent(toAddress) + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        window.location.href = mailtoLink;
    }
    function composeDelEmail() {
        var toAddress = "help@thintry.com";
        var subject = "New Account delet request!";

        var postData = {
            userId: userData._id,
            username: userData.username,
            email: userData.email,
            verified: userData.verified
        };

        var body = JSON.stringify(postData, null, 2); // Converts the postData object to a JSON string with formatting

        var mailtoLink = "mailto:" + encodeURIComponent(toAddress) + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        window.location.href = mailtoLink;
    }

    useEffect(() => {
        // Hide the header and footer when the component mounts
        const header = document.querySelector('.header'); // Replace with your header class or ID
        const footer = document.querySelector('.footer'); // Replace with your footer class or ID

        if (header) {
            header.style.display = 'none';
        }
        if (footer) {
            footer.style.display = 'none';
        }

        // Clean up by showing the header and footer when component unmounts
        return () => {
            if (header) {
                header.style.removeProperty('display');
            }
            if (footer) {
                footer.style.removeProperty('display');
            }
        };
    }, []);

    return (
        <div>
            <div className="settings-container">
                <div className="searchdiv">
                    <button id="navbackbtn" onClick={() => {
                        navigate(-1)
                    }} type="button">
                        <box-icon type='solid' name='chevron-left' color="#6fbf7e"></box-icon>
                    </button>
                    <div></div>
                </div>
                <div className="about-container">
                    <div className="static-area">
                        <div className="created" onClick={composeEmail}>
                            <box-icon name='bug' color='#6fbf7e'></box-icon>&nbsp;Report Bug
                        </div>
                        <div className="created" onClick={() => { delete_cookie('userData'); navigate('/auth/login'); }} style={{ color: 'orange' }}>
                            <box-icon name='log-out' color="orange"></box-icon>&nbsp;Logout
                        </div>
                        <div className="created" onClick={composeDelEmail} style={{ color: 'red' }}>
                            <box-icon name='trash' color='red'></box-icon>&nbsp;Deletion Request
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings
