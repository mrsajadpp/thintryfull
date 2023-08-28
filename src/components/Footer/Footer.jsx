import { React, useEffect } from 'react'
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";

import './Footer.css'
 
function Footer() {
  const location = useLocation();

  const isPageActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="footer" id="footer">
      <div className="icons">
        <nav>
          <Link to="/">
            <button>
              <box-icon type="solid" name='home' color={isPageActive('/') ? '#6fbf7e' : '#fff'}></box-icon>
            </button>
          </Link>
        </nav>
      </div>
      <div className="icons">
        <nav>
          <Link to="/messages">
            <button>
              <box-icon type="solid" name='message-square-dots' color={isPageActive('/messages') ? '#6fbf7e' : '#fff'}></box-icon>
            </button>
          </Link>
        </nav>
      </div>
      <div className="icons">
        <nav>
          <Link to="/tag/new">
            <button>
              <box-icon name='plus' color={isPageActive('/tag/new') ? '#6fbf7e' : '#fff'}></box-icon>
            </button>
          </Link>
        </nav>
      </div>
      <div className="icons">
        <nav>
          <Link to="/notifications">
            <button>
              <box-icon type='solid' name='bell' color={isPageActive('/notifications') ? '#6fbf7e' : '#fff'}></box-icon>
            </button>
          </Link>
        </nav>
      </div>
      <div className="icons">
        <nav>
          <Link to="/profile">
            <button>
              <box-icon name='user' color={isPageActive('/profile') ? '#6fbf7e' : '#fff'}></box-icon>
            </button>
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default Footer
