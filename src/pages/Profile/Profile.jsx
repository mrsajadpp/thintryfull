import { React, useEffect, useState, Suspense, lazy } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import './Profile.css'

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
    let userData = getUserDataFromCookie();
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

  // const [username, setUsername] = useState('');

  // useEffect(() => {
  //   const url = window.location.href;
  //   const parts = url.split('/');
  //   const usernameFromUrl = parts[parts.length - 1]; // Assuming username is the last part of the URL

  //   setUsername(usernameFromUrl);
  // }, []);

  let [userData, setData] = useState({});
  let [posts, setPost] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUserDataFromCookie();
        setData(userData)
        let response = await Axios.get('http://192.168.1.2:3001/api/fetch/user', { params: { username: userData.username } }, {
          headers: {
            'Access-Control-Allow-Origin': true,
          }
        });

        if (response.data.status) {
          setCookie('userData', JSON.stringify(response.data.user), 1);
        }
      } catch (error) {
        console.error('Fetching failed', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchPost() {
      try {
        const userData = await getUserDataFromCookie();
        let response = await Axios.get('http://192.168.1.2:3001/api/fetch/user/posts', { params: { uid: userData._id.toString() } }, {
          headers: {
            'Access-Control-Allow-Origin': true,
          }
        });

        if (response.data.status) {
          setPost(response.data.posts)
        }
      } catch (error) {
        console.error('Fetching failed', error);
      }
    }
    fetchPost();
  }, []);

  console.log(userData.profile)

  return (
    <div className="profile">
      <div class="profile-container">
        <div className="profile-card">
          <div className="dp">
            <div className="dp-ring">
              <img src={userData.profile ? userData.profile.startsWith('/') ? 'https://thintry.com' + userData.profile : userData.profile : userData.profile} onerror="this.src='/img/demopic.png'; this.onerror=null;"
                alt={userData.firstname + ' ' + userData.lastname} />
            </div>
            <div className="name-tag">
              <div className="name">{userData.firstname} {userData.lastname}
                {userData.official ? (
                  <box-icon type='solid' name='badge-check'
                    color="#6fbf7e"></box-icon>
                ) : (
                  userData.verified ? (
                    <box-icon type='solid' name='badge-check'
                      color="#fff"></box-icon>
                  ) : (
                    <p></p>
                  )
                )}
              </div>
              <div className="username">@{userData.username}</div>
            </div>
          </div>
          <div className="list">
            <Link to={'/followers/' + userData.username} className="lleft">
              <button className="lleft">
                <span>{userData.followers ? userData.followers.length : userData.followers}</span>Followers
              </button>
            </Link>
            <Link to={'/followings/' + userData.username} className="lright">
              <button className="lright">
                <span>{userData.followings ? userData.followings.length : userData.followings}</span>Following
              </button>
            </Link>
          </div>
          <div className="btns">
            <div className="buttons">
              <button id="editButton" onClick={() => { navigate('/profile/edit') }}><box-icon type='solid' name='pencil'></box-icon></button>&nbsp;&nbsp;
              <button className="tbtn" onClick={() => { navigate('/settings') }}><box-icon name='cog'></box-icon></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
