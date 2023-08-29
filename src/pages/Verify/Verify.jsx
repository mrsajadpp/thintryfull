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
    const navigate = useNavigate();
    const [logged, setLogged] = useState(false);

    useEffect(() => {
        Axios.get('http://localhost:3001/api/auth/check', { withCredentials: true })
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

    const verify = async (event) => {
        event.preventDefault();

        let otpInp = document.getElementById('otp');
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const verificationCode = urlParams.get('code');
        const uid = urlParams.get('uid');

        console.log(verificationCode)

        if (otpInp.value.length > 0) {
            try {
                let response = await Axios.get('http://localhost:3001/api/auth/verify/check', { params: { otp: otpInp.value, verificationCode, uid } }, { withCredentials: true })

                if (response.data.status) {
                    // Handle success, maybe redirect
                    navigate(`/profile`);
                } else {
                    otpInp.classList.replace('error-inp', 'noerror-inp');
                    // Handle error case
                    console.error('Verification failed');
                }
            } catch (error) {
                otpInp.classList.replace('error-inp', 'noerror-inp');
                console.error('Verification failed', error);
            }
        } else {
            otpInp.classList.replace('noerror-inp', 'error-inp');
        }
    };

    return (
        <div>
            <div className="loginForm">
                <div className="bannerArea">
                    <img src={logo} alt="" />
                </div>
                <div className="inputs">
                    <form onSubmit={verify}>
                        <div className="input">
                            <input type="number" onChange={verify} className="noerror-inp" name="otp" id="otp" placeholder="Verification Code" required autoComplete="off" />
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
