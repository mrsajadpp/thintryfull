import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Messages(props) {
  const navigate = useNavigate();
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    Axios.get('http://192.168.1.2:3001/api/auth/check')
      .then((response) => {
        setLogged(response.data.isLogged);
        if (!response.data.isLogged) {
          navigate('/auth/login'); // Redirect to /auth/login if not logged in
        }
      })
      .catch((err) => console.log(err));
  }, [navigate]);

  console.log(logged);

  useEffect(() => {
    const defaultTitle = "Thintry - Microblog";
    const updatedTitle = props.title ? `${props.title} - Thintry` : defaultTitle;
    document.title = updatedTitle;

    const metaDescription = props.description
      ? props.description
      : "Welcome to Thintry, a microblogging platform.";
    const metaKeywords = props.keywords
      ? `${props.keywords}, microblog, Thintry, social media`
      : "microblog, Thintry, social media";

    const metaDescriptionTag = document.head.querySelector('meta[name="description"]');
    if (metaDescriptionTag) {
      metaDescriptionTag.content = metaDescription;
    }

    const metaKeywordsTag = document.head.querySelector('meta[name="keywords"]');
    if (metaKeywordsTag) {
      metaKeywordsTag.content = metaKeywords;
    }
  }, [props.title, props.description, props.keywords]);

  return (
    <div>
      {/* Your component content goes here */}
    </div>
  );
}

export default Messages;
