import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import {
    Routes,
    Route,
    Link,
    useNavigate,
    useLocation
} from "react-router-dom";
import './Login.css';
import logo from './logo.png';

function Login(props) {

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

    async function login(event) {
        event.preventDefault();

        const form = event.target;
        console.log(form)
        const formData = new FormData(form);

        try {
            let response = await Axios.get('https://api.thintry.com/api/auth/login', { params: { username: formData.get('username'), password: formData.get('password') } }, {
                headers: {
                    'Access-Control-Allow-Origin': true,
                }
            })

            if (response.data.status) {
                setCookie('userData', JSON.stringify(response.data.user), 1); // Cookie will expire in 1 day
                navigate(`/profile`);
            } else {
                // Handle error case
                console.error('Login failed');
            }
        } catch (error) {
            console.error('Loginfailed', error);
        }
    }

    return (
        <div>
            <div className="loginForm">
                <div className="bannerArea">
                    <img src={logo} alt="" />
                </div>
                <div className="inputs">
                    <form onSubmit={login}>
                        <div className="input">
                            <input type="text" className="noerror-inp" id="username" name="username" placeholder="Username" required
                                autoComplete='off' onChange={(event) => {
                                    let username = document.getElementById('username');
                                    const newValue = event.target.value.replace(/ /g, '').toLowerCase(); // Remove spaces and convert to lowercase
                                    username.value = newValue;

                                    if (newValue.length <= 0) {
                                        username.classList.replace('noerror-inp', 'error-inp');
                                    } else {
                                        Axios.get('https://api.thintry.com/api/username/check', { params: { username: newValue } }, {
                                            headers: {
                                                'Access-Control-Allow-Origin': true,
                                            }
                                        })
                                            .then((response) => {
                                                if (response.data) {
                                                    if (response.data.usernameExist) {
                                                        username.classList.replace('error-inp', 'noerror-inp');
                                                    } else {
                                                        username.classList.replace('noerror-inp', 'error-inp');
                                                    }
                                                }
                                            })
                                            .catch((error) => {
                                                console.error(error);
                                            });
                                    }
                                }} />
                            <span id="usernameError" className="error"></span>
                        </div>
                        <div className="input">
                            <input type="password" className="noerror-inp" id="password" name="password" placeholder="Password" required
                                autoComplete="off" onChange={(event) => {
                                    let password = document.getElementById('password');
                                    const newValue = event.target.value;

                                    const hasCapitalLetter = /[A-Z]/.test(newValue);
                                    const hasCharacter = /[a-zA-Z]/.test(newValue);

                                    if (newValue.length < 8 || !hasCapitalLetter || !hasCharacter) {
                                        password.classList.replace('noerror-inp', 'error-inp');
                                    } else {
                                        password.classList.replace('error-inp', 'noerror-inp');
                                    }
                                }} />
                            <span id="passwordError" className="error"></span>
                        </div>
                        <div className="loginbtn">
                            <button>LogIn</button>
                        </div>
                        <div className="textarea">
                            <span>Don't have an account? , <Link to="/auth/signup">SignUp</Link>.</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
