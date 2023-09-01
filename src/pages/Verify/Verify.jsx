import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import {
    Routes,
    Route,
    Link,
    useNavigate,
    useLocation
} from "react-router-dom";
import logo from './logo.png';
import './Verify.css';

function Verify(props) {
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
    }

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

    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is already logged in using the cookie
        const userData = getUserDataFromCookie();
        if (userData) {
            if (userData.status) {
                navigate("/profile");
                return; // No need to continue checking if already logged in
            }
        }
    }, [navigate]);

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

    const verify = async (event) => {
        event.preventDefault();
        console.log('otp')

        let otpInp = document.getElementById('otp');
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const verificationCode = urlParams.get('code');
        const uid = urlParams.get('uid');

        console.log(verificationCode)

        if (otpInp.value.length >= 6) {
            try {
                let response = await Axios.get('https://api.thintry.com/auth/verify/check', { params: { otp: otpInp.value, verificationCode, uid } }, {
                    headers: {
                        'Access-Control-Allow-Origin': true,
                    }
                });

                if (response.data.status) {
                    otpInp.classList.replace('error-inp', 'noerror-inp');
                    // Store user data in a cookie
                    console.log(response.data.user)
                    setCookie('userData', JSON.stringify(response.data.user), 1); // Cookie will expire in 1 day

                    // Handle success, maybe redirect
                    navigate(`/profile`);
                } else {
                    otpInp.classList.replace('noerror-inp', 'error-inp');
                    // Handle error case
                    console.error('Verification failed');
                }
            } catch (error) {
                otpInp.classList.replace('noerror-inp', 'error-inp');
                console.error('Verification failed', error);
            }
        } else {
            otpInp.classList.replace('noerror-inp', 'error-inp');
        }
    };

    function validateCode(e) {
        let otpInp = document.getElementById('otp');
        if (otpInp.value < 6) {
            otpInp.classList.replace('noerror-inp', 'error-inp');
        } else {
            otpInp.classList.replace('error-inp', 'noerror-inp');
        }
    }

    return (
        <div>
            <div className="loginForm">
                <div className="bannerArea">
                    <img src={logo} alt="" />
                </div>
                <div className="inputs">
                    <form onSubmit={verify}>
                        <div className="input">
                            <input type="number" onChange={validateCode} className="noerror-inp" name="otp" id="otp" placeholder="Verification Code" required autoComplete="off" />
                        </div>
                        <div className="loginbtn">
                            <button>Verify</button>
                        </div>
                        <div className="textarea">
                            <span>Check your email box?.</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Verify
