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

    const navigate = useNavigate();
    const [logged, setLogged] = useState(false);

    useEffect(() => {
        Axios.get('http://192.168.1.2:3001/api/auth/check')
            .then((response) => {
                setLogged(response.data.isLogged);
                if (response.data.isLogged) {
                    navigate('/');
                }
            })
            .catch((err) => console.log(err));
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
                header.style.display = 'block';
            }
            if (footer) {
                footer.style.display = 'block';
            }
        };
    }, []);

    return (
        <div>
            <div className="loginForm">
                <div className="bannerArea">
                    <img src={logo} alt="" />
                </div>
                <div className="inputs">
                    <form action="/auth/login" method="post">
                        <div className="input">
                            <input type="text" className="noerror-inp" id="username" name="username" placeholder="Username" required
                                autoComplete='off' onChange={(event) => {
                                    let username = document.getElementById('username');
                                    const newValue = event.target.value.replace(/ /g, '').toLowerCase(); // Remove spaces and convert to lowercase
                                    username.value = newValue;

                                    if (newValue.length <= 0) {
                                        username.classList.replace('noerror-inp', 'error-inp');
                                    } else {
                                        Axios.get('http://192.168.1.2:3001/api/username/check', { params: { username: newValue } })
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
