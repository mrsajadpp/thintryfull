import { React, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';

function Profile(props) {
  const navigate = useNavigate();

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

  useEffect(() => {
    // Check if the user is already logged in using the cookie
    const userData = getUserDataFromCookie();
    if (!userData) {
      navigate("/auth/login");
      return; // No need to continue checking if already logged in
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
  const location = useLocation();

  const isPageActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="profile">

    </div>
  );
}

export default Profile;
