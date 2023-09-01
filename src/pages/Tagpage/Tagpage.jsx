import { React, useEffect, useState, Suspense, lazy } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Axios from 'axios';
import Audioplayer from '../../components/Audioplayer/Audioplayer';
import Alert from '../../components/Alert/Alert';

function Tagpage(props) {
    const { tagId } = useParams();
    const [userData, setUser] = useState({});
    const [tag, setTag] = useState({});
    const [replies, setReplies] = useState([]);
    const navigate = useNavigate();
    const [upTag, setUpTag] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertData, setAlert] = useState({});

    useEffect(() => {
        // Default title
        const defaultTitle = "Tag By '@" + (tag.user ? tag.user.username : 'unknown') + "'!";
        const updatedTitle = props.title ? `${props.title} - Thintry` : defaultTitle;
        document.title = updatedTitle;

        // Default meta description and keywords
        const metaDescription = props.description ? props.description : tag.content;
        const metaKeywords = props.keywords ? `${props.keywords}, microblog, Thintry, social media` : "microblog, Thintry, social media," + (tag.user ? (`${tag.user.username}, ${tag.user.firstname}, ${tag.user.lastname},`) : (''));

        // Update meta description tag
        const metaDescriptionTag = document.querySelector('meta[name="description"]');
        if (metaDescriptionTag) {
            metaDescriptionTag.content = metaDescription;
        }

        // Update meta keywords tag
        const metaKeywordsTag = document.querySelector('meta[name="keywords"]');
        if (metaKeywordsTag) {
            metaKeywordsTag.content = metaKeywords;
        }
    }, [tag, props.title, props.description, props.keywords]);


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
        let userData = getUserDataFromCookie();
        if (userData) {
            setUser(userData);
        }
    }, []);

    useEffect(() => {
        async function fetchTag(tagId) {
            try {
                let response = await Axios.get('https://api.thintry.com/api/fetch/tag', { params: { tagId } }, {
                    headers: {
                        'Access-Control-Allow-Origin': true,
                    }
                });

                if (response.data.status) {
                    setTag(response.data.tag);
                    let res = await Axios.get('https://api.thintry.com/api/fetch/tag/replies', { params: { tagId } }, {
                        headers: {
                            'Access-Control-Allow-Origin': true,
                        }
                    });
                    if (res.data.status) {
                        setReplies(res.data.replies)
                    }
                }
            } catch (error) {
                console.error('Fetching failed', error);
            }
        }
        fetchTag(tagId);
    }, [props, upTag]);

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

    const handleUpvote = async (tagId) => {
        try {
            if (userData.status) {
                const response = await Axios.post(
                    'https://api.thintry.com/api/tag/upvote',
                    { tagId, uid: userData._id },
                    {
                        headers: {
                            'Access-Control-Allow-Origin': true,
                        },
                    }
                );

                if (response.data.status) {
                    setUpTag(Math.floor(Math.random() * (1 - 9)) + 1)
                }
            } else {
                navigate('/auth/login')
            }
        } catch (error) {
            console.error('Upvote failed', error);
        }
    };

    const handleDownvote = async (tagId) => {
        try {
            if (userData.status) {
                const response = await Axios.post(
                    'https://api.thintry.com/api/tag/downvote',
                    { tagId, uid: userData._id },
                    {
                        headers: {
                            'Access-Control-Allow-Origin': true,
                        },
                    }
                );

                if (response.data.status) {
                    setUpTag(Math.floor(Math.random() * (1 - 9)) + 1)
                }
            } else {
                navigate('/auth/login')
            }
        } catch (error) {
            console.error('Downvote failed', error);
        }
    };

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

    const handleAlertAction = () => {
        async function delTag() {
            try {
                let response = await Axios.get('https://api.thintry.com/api/tag/delete', { params: { uid: userData._id, tagId: alertData.tagId } }, {
                    headers: {
                        'Access-Control-Allow-Origin': true,
                    }
                });

                if (response.data.status) {
                    navigate(-1);
                }
            } catch (error) {
                console.error('Fetching failed', error);
            }
        }
        delTag()
    }

    const displayAlert = (message, api, leftButtonText, rightButtonText, tagId) => {
        setAlert({
            message,
            api,
            leftButtonText,
            rightButtonText,
            tagId
        });
        setShowAlert(true);
    };

    return (
        <div>
            <div className="post-co" id="postConta">
                <div className="searchdiv" style={{ backgroundColor: '#060002' }}>
                    <button id="navB" type="button">
                        <box-icon
                            type='solid'
                            onClick={() => navigate(-1)}
                            name='chevron-left'
                            color='#6fbf7e'
                        ></box-icon>
                    </button>
                    <div></div>
                </div>
            </div>
            <div id='page'>
                <div id={tag._id} key={tag._id} className="tweet">
                    <div className="tweet-container pt pb pr pl">
                        {/* User */}
                        <div className="user pr">
                            <div className="userl" onClick={() => { navigate('/user/' + tag.user.username) }}>
                                <div className="profile">
                                    <img
                                        src={tag.user && tag.user.profile ? (tag.user.profile.startsWith('/') ? 'https://thintry.com' + tag.user.profile : tag.user.profile) : 'https://api.thintry.com/img/demopic.png'}
                                        onError={(event) => {
                                            event.target.src = 'https://api.thintry.com/img/demopic.png';
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
                            {tag.audio ? (<Audioplayer url={tag.audio.src} />) : (<Link id='link-style' to={`/tag/${tag._id}`} dangerouslySetInnerHTML={{ __html: parseContent(tag.content) }}></Link>)}
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
                            <span
                                id={`up-${tag._id}`}
                                onClick={() => {
                                    if (userData && tag && tag.upvote) { // Check if userData, tag, and tag.upvote exist
                                        handleUpvote(tag._id);
                                    }
                                }}
                            >
                                <box-icon
                                    type="solid"
                                    name="up-arrow"
                                    color={userData && tag && tag.upvote && tag.upvote.includes(userData._id) ? "#6fbf7e" : "#fff"}
                                    className="img"
                                />
                            </span>
                            <div className="number">
                                <span id={`up-count-${tag._id}`} className="up-count">
                                    {formatNumber(tag && tag.upvote ? tag.upvote.length : '')}
                                </span>
                            </div>
                        </div>

                        <div className="ico">
                            <span
                                id={`dow-${tag._id}`}
                                onClick={() => {
                                    if (userData && tag && tag.downvote) { // Check if userData, tag, and tag.downvote exist
                                        handleDownvote(tag._id);
                                    }
                                }}
                            >
                                <box-icon
                                    type="solid"
                                    name="down-arrow"
                                    color={userData && tag && tag.downvote && tag.downvote.includes(userData._id) ? "#6fbf7e" : "#fff"}
                                    className="img"
                                />
                            </span>
                            <div className="number">
                                <span id={`dow-count-${tag._id}`} className="down-count">
                                    {formatNumber(tag && tag.downvote ? tag.downvote.length : '')}
                                </span>
                            </div>
                        </div>
                        {tag.user && tag.user._id ? (
                            userData && userData._id == tag.user._id ? (
                                <div className="ico">
                                    <box-icon type='solid' name='trash' color="red" className="img" onClick={() => {
                                        displayAlert('Do you really want to delete this tag?', 'https://api.thintry.com/api/tag/delete', 'Yes', 'No', `${tag._id}`);
                                    }} />
                                </div>
                            ) : (
                                ''
                            )
                        ) : (
                            ''
                        )}
                        <div className="ico">
                            <box-icon name='link' color="#fff" className="img" onClick={() => copyUrl(`https://api.thintry.com/tag/${tag._id}`)} />
                        </div>
                    </div>
                </div>
                <div style={{ width: '100%', height: '60px' }}></div>
                {showAlert && (
                    <Alert
                        message={alertData.message}
                        api={alertData.api}
                        leftButtonText={alertData.leftButtonText}
                        rightButtonText={alertData.rightButtonText}
                        tagId={alertData.tagId}
                        showAlert={showAlert}
                        hideAlert={() => setShowAlert(false)}
                        onAction={handleAlertAction}
                    />
                )}
            </div>
        </div>
    )
}

export default Tagpage
