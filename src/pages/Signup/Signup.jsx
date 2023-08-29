import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";
import './Signup.css';
import logo from './logo.png';

function Signup(props) {

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

  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    console.log(form)
    const formData = new FormData(form);

    try {
      let response = await Axios.get('http://192.168.1.2:3001/api/auth/signup', { params: { firstname: formData.get('firstname'), lastname: formData.get('lastname'), username: formData.get('username'), password: formData.get('password'), email: formData.get('email') } }, {
        headers: {
          'Access-Control-Allow-Origin': true,
        }
      })

      if (response.data.status) {
        // Handle success, maybe redirect
        const verificationCode = response.data.user.encrypted_verification_code; // Assuming your response includes the verification code
        console.log(verificationCode)
        navigate(`/auth/verify?code=${verificationCode}&uid=${response.data.user._id}`);
      } else {
        // Handle error case
        console.error('Signup failed');
      }
    } catch (error) {
      console.error('Signup failed', error);
    }
  };

  return (
    <div>
      <div className="loginForm">
        <div className="bannerArea">
          <img src={logo} alt="" />
        </div>
        <div className="inputs">
          <form onSubmit={handleSubmit}>
            <div className="name">
              <div className="input">
                <input type="text" className="noerror-inp" id="firstname" name="firstname" placeholder="First Name"
                  required autoComplete="off" onChange={() => {
                    let firstname = document.getElementById('firstname');
                    if (firstname.value.length <= 0) {
                      firstname.classList.replace('noerror-inp', 'error-inp'); // Corrected line
                    } else {
                      firstname.classList.replace('error-inp', 'noerror-inp');
                    }
                  }} />
                <span id="firstnameError" className="error"></span>
              </div>&nbsp;
              <div className="input">
                <input className="noerror-inp" type="text" id="lastname" name="lastname" placeholder="Last Name"
                  required autoComplete="off" onChange={() => {
                    let lastname = document.getElementById('lastname');
                    if (lastname.value.length <= 0) {
                      lastname.classList.replace('noerror-inp', 'error-inp'); // Corrected line
                    } else {
                      lastname.classList.replace('error-inp', 'noerror-inp');
                    }
                  }} />
                <span id="lastnameError" className="error"></span>
              </div>
            </div>
            <div className="input">
              <input type="text" className="noerror-inp" id="username" name="username" placeholder="Username" required autoComplete="off" onChange={(event) => {
                let username = document.getElementById('username');
                const newValue = event.target.value.replace(/ /g, '').toLowerCase(); // Remove spaces and convert to lowercase
                username.value = newValue;

                if (newValue.length <= 0) {
                  username.classList.replace('noerror-inp', 'error-inp');
                } else {
                  Axios.get('http://192.168.1.2:3001/api/username/check', { params: { username: newValue } }, {
                    headers: {
                      'Access-Control-Allow-Origin': true,
                    }
                  })
                    .then((response) => {
                      if (response.data) {
                        if (response.data.usernameExist) {
                          username.classList.replace('noerror-inp', 'error-inp');
                        } else {
                          username.classList.replace('error-inp', 'noerror-inp');
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
              <input type="email" className="noerror-inp" id="email" name="email" placeholder="Email" required autoComplete="off" onChange={(event) => {
                let email = document.getElementById('email');
                const newValue = event.target.value.trim(); // Remove leading and trailing spaces
                email.value = newValue;

                if (newValue.length <= 0) {
                  email.classList.replace('noerror-inp', 'error-inp');
                } else if (!isValidEmail(newValue)) {
                  email.classList.replace('noerror-inp', 'error-inp');
                } else {
                  email.classList.replace('error-inp', 'noerror-inp');
                }
              }} />
              <span id="emailError" className="error"></span>
            </div>
            <div className="input">
              <input type="password" className="noerror-inp" name="password" id="password" placeholder="Password" required autoComplete="off" onChange={(event) => {
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
              <button type='submit'>SignUp</button>
            </div>
            <div className="textarea">
              <span>Already have an account? , <Link to="/auth/login">LogIn</Link>.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup
