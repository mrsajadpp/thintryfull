import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Axios from 'axios';
import Loading from './components/Loading/Loading'
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Messages from './pages/Messages/Messages';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Notificastions from './pages/Notifications/Notificastions';
import Verify from './pages/Verify/Verify';
import Settings from './pages/Settings/Settings';

function App() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Header />
        <Routes>
          <Route path="/auth/login" element={<Login title='Login' />} />
          <Route path="/auth/signup" element={<Signup title='Signup' />} />
          <Route path="/auth/verify" element={<Verify title='Verify Your Account' />} />
          <Route path="/" element={<Home />} />
          <Route path="/messages" element={<Messages title='Messages' />} />
          <Route path="/notifications" element={<Notificastions title='Notifications' />} />
          <Route path="/profile" element={<Profile title='Profile' />} />
          <Route path="/settings" element={<Settings title='Settings' />} />
        </Routes>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;
