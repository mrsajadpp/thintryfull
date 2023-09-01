import { React, useEffect, useState } from 'react'
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";

import './Alert.css';

function Alert(props) {
    const naviagte = useNavigate();
  return (
    <div>
      <div className="alert-container">
        <div className="alert-box">
            <div className="alert-content">
                <div className="alert-message">
                    {props.message}
                </div>
            </div>
            <div className="alert-buttons">
                <div className="left-button" onClick={props.onAction}>
                    <button>{props.leftButtonText}</button>
                </div>
                <div className="right-button" onClick={props.hideAlert}>
                    <button>{props.rightButtonText}</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Alert
