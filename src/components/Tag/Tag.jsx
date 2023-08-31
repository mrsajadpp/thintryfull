import { React, useEffect, useState, Suspense, lazy } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';

function Tag(props) {
  console.log(props.userData)
  const navigate = useNavigate();
  const [userData,setData] = useState([]);
  const [tags, setTags] = useState([]);
  useEffect(() => {
    async function fetchTags(uid) {
      try {
        let response = await Axios.get('http://192.168.1.3:3001/api/fetch/user/tags', { params: { uid } }, {
          headers: {
            'Access-Control-Allow-Origin': true,
          }
        });

        if (response.data.status) {
          setTags(response.data.tags);
        }
      } catch (error) {
        console.error('Fetching failed', error);
      }
    }
    fetchTags(props.userData._id);
  }, [props.userData]);

  const copyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (error) {
      // Fallback for browsers that don't support Clipboard API
      const tempTextArea = document.createElement('textarea');
      tempTextArea.value = url;
      document.body.appendChild(tempTextArea);
      tempTextArea.select();
      document.execCommand('copy');
      document.body.removeChild(tempTextArea);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp); // Convert to milliseconds
    // Now you can use the toDateString method
    const formattedTime = date.toDateString();
    return formattedTime;
  };

  const formatNumber = (value) => {
    if (value >= 1000000) {
      return (value / 1000000) + 'M';
    } else if (value >= 1000) {
      return (value / 1000) + 'K';
    } else {
      return value;
    }
  }

  function composeEmail(tag) {
    var toAddress = "help@thintry.com";
    var subject = "New post report!";

    var postData = {
      postID: tag._id,
      content: tag.content,
      timestamp: tag.timestamp,
      upvotes: tag.upvote.length,
      downvotes: tag.downvote.length
    };

    var body = JSON.stringify(postData, null, 2); // Converts the postData object to a JSON string with formatting

    var mailtoLink = "mailto:" + encodeURIComponent(toAddress) + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    window.location.href = mailtoLink;
  }

  return (
    <div>
      {tags.map(tag => (
        <div id={tag._id} className="tweet">
          <div className="tweet-container pt pb pr pl">
            {/* User */}
            <div className="user pr">
              <div className="userl" onClick={() => { navigate('/profile') }}>
                <div className="profile">
                  <img src={props.userData.profile ? props.userData.profile.startsWith('/') ? 'https://thintry.com' + props.userData.profile : props.userData.profile : props.userData.profile} onError={(event) => { event.target.src = 'https://thintry.com/img/demopic.png'; event.target.onError = null; }} />
                </div>
                <div className="username">
                  <div className="name">{props.userData.firstname} {props.userData.lastname}
                    {props.userData.official ? (
                      <box-icon type='solid' name='badge-check'
                        color="#6fbf7e"></box-icon>
                    ) : (
                      props.userData.verified ? (
                        <box-icon type='solid' name='badge-check'
                          color="#fff"></box-icon>
                      ) : (
                        <p></p>
                      )
                    )}
                  </div>
                  <div className="handle">@{props.userData.username}</div>
                </div>
              </div>
              <div className="userr">
                <div className="follow">
                  <button className="bttwo post-menu" onClick={() => {
                    composeEmail(tag);
                  }}>
                    <box-icon name='flag-alt' type="solid" color="orange"></box-icon>
                  </button>
                </div>
              </div>
            </div>

            {/* Tweet content */}
            <div className="tweet-content pt">
              <Link className='link-style' to={`/post/${tag._id}`}>{tag.content}</Link>
            </div>

            {/* Date and location */}
            <div className="date pt pb">{formatTime(tag.timestamp)} • from {' '}
              <Link to={`https://www.google.com/maps/search/${encodeURIComponent(props.userData ? props.userData.created.location.region : '')}`}
                title="Search on Google Maps">{props.userData ? props.userData.created.location.region : ''},
                {props.userData ? props.userData.created.location.country : ''}</Link>
            </div>

            {/* Upvotes and Downvotes */}
            <div className="rl pt pb">
              <div className="retweets">
                <b>
                  <span className="up-count" id={`main-up-count-${tag._id}`}>
                    {formatNumber(tag.upvote ? tag.upvote.length : '')}
                  </span>
                </b>{' '}
                Upvotes
              </div>
              <div className="likes">
                <b>
                  <span className="down-count" id={`main-dow-count-${tag._id}`}>
                    {formatNumber(tag.downvote ? tag.downvote.length : '')}
                  </span>
                </b>{' '}
                Downvotes
              </div>
            </div>
          </div>

          {/* Icons */}
          <div className="icons">
            <div className="ico">
              <box-icon name='message-square-add' onClick={() => { navigate(`/tag/${tag._id}`) }} color="#fff" className="img" />
              <div className="number">{formatNumber(tag.reply ? tag.reply.length : '')}</div>
            </div>
            <div className="ico">
              {tag.upvote.includes(props.userData._id) ? (
                <span id={`up-${tag._id}`}>
                  <box-icon type='solid' name='up-arrow' color="#6fbf7e" className="img" />
                </span>
              ) : (
                <span id={`up-${tag._id}`}>
                  <box-icon type='solid' name='up-arrow' color="#fff" className="img" />
                </span>
              )}
              <div className="number">
                <span id={`up-count-${tag._id}`} className="up-count">{formatNumber(tag.upvote ? tag.upvote.length : '')}</span>
              </div>
            </div>
            <div className="ico">
              {tag.downvote.includes(props.userData._id) ? (
                <span id={`dow-${tag._id}`}>
                  <box-icon name='down-arrow' type='solid' color="#6fbf7e" className="img" />
                </span>
              ) : (
                <span id={`dow-${tag._id}`}>
                  <box-icon name='down-arrow' type='solid' color="#fff" className="img" />
                </span>
              )}
              <div className="number">
                <span id={`dow-count-${tag._id}`} className="down-count">{formatNumber(tag.downvote ? tag.downvote.length : '')}</span>
              </div>
            </div>
            <div className="ico">
              <box-icon type='solid' name='trash' color="red" className="img" />
            </div>
            <div className="ico">
              <box-icon name='link' color="#fff" className="img" onClick={() => copyUrl(`https://thintry.com/tag/${tag._id}`)} />
            </div>
          </div>
        </div>))}
        <div style={{ width: '100%', height: '60px' }}></div>
    </div>
  )
}

export default Tag
