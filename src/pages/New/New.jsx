import { React, useEffect, useState, Suspense, lazy } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import './New.css';

function New(props) {

    let [userData, setData] = useState({});

    const [isPostContainerActive, setPostContainerActive] = useState(false);

    const togglePostContainer = () => {
        setPostContainerActive(prevState => !prevState);
    };

    const validateForm = () => {
        const textareaValue = document.getElementById('content').value;
        const alphabetRegex = /[a-zA-Z]/g;
        const alphabetCount = (textareaValue.match(alphabetRegex) || []).length;

        if (alphabetCount < 1) {
            alert('Content must contain at least 10 alphabets.');
            return false;
        }

        return true;
    };

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
        if (!userData) {
            if (!userData.status) {
                navigate("/auth/login");
                return; // No need to continue checking if already logged in
            }
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

    useEffect(() => {
        async function fetchData() {
            try {
                const userData = await getUserDataFromCookie();
                setData(userData)
                let response = await Axios.get('http://192.168.1.4:3001/api/fetch/user', { params: { username: userData.username } }, {
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

    const newPost = () => {
        let content = document.getElementById('tagcont');
        if (content.value.length <= 0) {
            content.classList.replace('noerror-inp', 'error-inp');
        } else {
            Axios.get(
                'http://192.168.1.4:3001/api/tag/new',
                { params: { _id: userData._id, content: content.value } },
                {
                    headers: {
                        'Access-Control-Allow-Origin': true,
                    },
                }
            )
                .then((response) => {
                    if (response.data) {
                        if (
                            response.data.status
                        ) {
                            navigate(`/tag/${response.data.tag._id}`);
                        } else {
                            content.classList.replace('noerror-inp', 'error-inp');
                        }
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    return (
        <div>
            <div className="newpost-cont">
                <div className="searchdiv">
                    <button id="navbackbtn" onClick={() => {
                        navigate(-1)
                    }} type="button">
                        <box-icon type='solid' name='chevron-left' color="#6fbf7e"></box-icon>
                    </button>
                    <div style={{ width: '100%' }}></div>
                    <button onClick={newPost}>
                        <box-icon type='solid' name='send' color="#fff"></box-icon>
                    </button>
                </div>

                <div className="tag-area">
                    <div className="text-tag">
                        <textarea name="content" className='noerror-inp' id="tagcont" cols="30" rows="10" maxLength={300} placeholder='What happening now?'></textarea>
                    </div>
                    <div className="textcenter">
                        Remember to keep respect!
                    </div>
                    {/* <div className="submit-btn">
                        
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default New
