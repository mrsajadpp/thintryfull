import { React, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

function Profile(props) {
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
