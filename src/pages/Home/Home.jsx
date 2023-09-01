import { React, useEffect, useState, Suspense, lazy } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Audioplayer from '../../components/Audioplayer/Audioplayer';

function Home(props) {
    const navigate = useNavigate();
    const [userData, setData] = useState([]);
    const [tags, setTags] = useState([]);

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
        async function fetchAllTags() {
            try {
                const response = await Axios.get('http://192.168.66.248:3001/api/fetch/user/tags/all', {
                    headers: {
                        'Access-Control-Allow-Origin': true,
                    },
                });

                if (response.data.status) {
                    setTags(response.data.tags);
                }
            } catch (error) {
                console.error('Fetching failed', error);
            }
        }
        fetchAllTags();
    }, []);

    useEffect(() => {
        let userData = getUserDataFromCookie();
        if (userData) {
            setData(userData);
        }
    }, []);

    function parseContent(content) {
        if (!content) {
            return 'Unknown content!'; // Return an empty string if content is undefined or null
        }
        const hashtagRegex = /#[A-Za-z0-9_-]+/g;
        const urlRegex = /(?<!href=')(?<!src=')(https?:\/\/[^\s]+)/g; // Updated regex to exclude URLs within img src attribute
        const mentionRegex = /@([A-Za-z0-9_.-]+)/g;

        const parsedUrlContent = content.replace(urlRegex, (match) => {
            return `<a href="${match}" style="color: lightblue !important;" target="_blank">${match}</a>`;
        });

        const parsedContentWithMentions = parsedUrlContent.replace(mentionRegex, (match, mention) => {
            return `<a href="/user/${mention}" style="color: lightblue !important;">${match}</a>`;
        });

        const parsedContent = parsedContentWithMentions.replace(hashtagRegex, (match) => {
            const hashtag = match.substring(1);
            return `<a href="/search?q=${hashtag}" style="color: lightblue !important;">${match}</a>`;
        });

        return parsedContent;
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
        <div style={{ marginTop: '60px' }} id='page'>
            {tags.map(tag => (
                <div id={tag._id} key={tag._id} className="tweet">
                    <div className="tweet-container pt pb pr pl">
                        {/* User */}
                        <div className="user pr">
                            <div className="userl" onClick={() => { navigate('/profile') }}>
                                <div className="profile">
                                    <img
                                        src={tag.user && tag.user.profile ? (tag.user.profile.startsWith('/') ? 'https://thintry.com' + tag.user.profile : tag.user.profile) : 'https://thintry.com/img/demopic.png'}
                                        onError={(event) => {
                                            event.target.src = 'https://thintry.com/img/demopic.png';
                                            event.target.onError = null;
                                        }}
                                    />
                                </div>
                                <div className="username">
                                    <div className="name">
                                        {tag.user && tag.user.firstname && tag.user.lastname ? (
                                            <>
                                                {tag.user.firstname} {tag.user.lastname}
                                                {tag.user.official ? (
                                                    <box-icon type='solid' name='badge-check' color="#6fbf7e"></box-icon>
                                                ) : (
                                                    tag.user.verified ? (
                                                        <box-icon type='solid' name='badge-check' color="#fff"></box-icon>
                                                    ) : (
                                                        <p></p>
                                                    )
                                                )}
                                            </>
                                        ) : 'Unknown'}
                                    </div>

                                    <div className="handle">
                                        {tag.user && tag.user.username ? `@${tag.user.username}` : '@unknown'}
                                    </div>

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
                            {tag.audio ? (<Audioplayer url={tag.audio.src} />) : (<Link id='link-style' to={`/post/${tag._id}`} dangerouslySetInnerHTML={{ __html: parseContent(tag.content) }}></Link>)}
                        </div>

                        {/* Date and location */}
                        <div className="date pt pb">{formatTime(tag.timestamp)} • from {' '}
                            <Link to={`https://www.google.com/maps/search/${encodeURIComponent(tag.user ? tag.user.created.location.region : 'unknown')}`}
                                title="Search on Google Maps">{tag.user ? tag.user.created.location.region : 'Unknown'},{' '}
                                {tag.user ? tag.user.created.location.country : 'NA'}</Link>
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
                            <box-icon type='solid' name='message-square-dots' onClick={() => { navigate(`/tag/${tag._id}`) }} color="#fff" className="img" />
                            <div className="number">{formatNumber(tag.replies ? tag.replies.length : '')}</div>
                        </div>
                        <div className="ico">
                            {tag.user && tag.user._id ? (
                                tag.upvote.includes(tag.user._id) ? (
                                    <span id={`up-${tag._id}`}>
                                        <box-icon type='solid' name='up-arrow' color="#6fbf7e" className="img" />
                                    </span>
                                ) : (
                                    <span id={`up-${tag._id}`}>
                                        <box-icon type='solid' name='up-arrow' color="#fff" className="img" />
                                    </span>
                                )
                            ) : (
                                <span>
                                    <box-icon type='solid' name='up-arrow' color="#fff" className="img" />
                                </span>
                            )}
                            <div className="number">
                                <span id={`up-count-${tag._id}`} className="up-count">{formatNumber(tag.upvote ? tag.upvote.length : '')}</span>
                            </div>
                        </div>

                        <div className="ico">
                            {tag.user && tag.user._id ? (
                                tag.downvote.includes(tag.user._id) ? (
                                    <span id={`dow-${tag._id}`}>
                                        <box-icon type='solid' name='down-arrow' color="#6fbf7e" className="img" />
                                    </span>
                                ) : (
                                    <span id={`dow-${tag._id}`}>
                                        <box-icon type='solid' name='down-arrow' color="#fff" className="img" />
                                    </span>
                                )
                            ) : (
                                <span >
                                    <box-icon type='solid' name='down-arrow'  color="#fff" className="img" />
                                </span>
                            )}
                            <div className="number">
                                <span id={`dow-count-${tag._id}`} className="down-count">{formatNumber(tag.downvote ? tag.downvote.length : '')}</span>
                            </div>
                        </div>
                        {tag.user && tag.user._id ? (
                            userData && userData._id == tag.user._id ? (
                                <div className="ico">
                                    <box-icon type='solid' name='trash' color="red" className="img" />
                                </div>
                            ) : (
                                ''
                            )
                        ) : (
                            ''
                        )}
                        <div className="ico">
                            <box-icon name='link' color="#fff" className="img" onClick={() => copyUrl(`https://thintry.com/tag/${tag._id}`)} />
                        </div>
                    </div>
                </div>))}
            <div style={{ width: '100%', height: '60px' }}></div>
        </div>
    )
}

export default Home;
