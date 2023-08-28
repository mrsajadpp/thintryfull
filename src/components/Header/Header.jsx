import { React, useEffect } from 'react'
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";
import './Header.css'
import logo from './logo.png';

function Header() {
  const location = useLocation();

  const isPageActive = (path) => {
    return location.pathname === path;
  };
  return (
    <div className="header">
      <div className="hleft">
        <Link to="/">
          <img src={logo} alt="Thintry a indian social media website." />
        </Link>
      </div>
      <div className="hright">
        <nav>
          <Link to="/" className='deskmenu'>
            <button>
              <box-icon type="solid" name='home' color={isPageActive('/') ? '#6fbf7e' : '#fff'}></box-icon>
            </button>
          </Link>
          <Link to="/search" id='searchBtn'>
            <button>
              <box-icon name='search' color={isPageActive('/search') ? '#6fbf7e' : '#fff'}></box-icon>
            </button>
          </Link>
          <Link to="/messages" className='deskmenu'>
            <button>
              <box-icon type="solid" name='message-square-dots' color={isPageActive('/messages') ? '#6fbf7e' : '#fff'}></box-icon>
            </button>
          </Link>
          <Link to="/notifications" className='deskmenu'>
            <button>
              <box-icon name='bell' type='solid' color={isPageActive('/notifications') ? '#6fbf7e' : '#fff'}></box-icon>
            </button>
          </Link>
          <Link to="/profile" className='deskmenu'>
            <button>
              <box-icon name='user' color={isPageActive('/profile') ? '#6fbf7e' : '#fff'}></box-icon>
            </button>
          </Link>
          <Link to="/tag/new" id="postPlusBtn" className='deskmenu'>
            <button>
              <box-icon name='plus' color={isPageActive('/tag/new') ? '#6fbf7e' : '#fff'}></box-icon>
            </button>
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default Header
