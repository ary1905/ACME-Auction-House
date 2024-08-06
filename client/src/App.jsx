import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Features } from "./components/features";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Login } from "./components/login";
import { Signup } from "./components/signup";
import { Contact } from "./components/contact";
import { Dashboard } from "./components/dashboard";
import { VerifyEmail } from './components/verify';
import { MyBids } from "./components/myBids";
import { Profile } from "./components/profile";
import {AddItem} from "./components/addItem"
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";
export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <Router>
      <Navigation token={token} setToken={setToken} />
      <Routes>
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/error" element={<div>Error occurred during verification.</div>} />
        <Route path="/" element={
          <>
            <Header data={landingPageData.Header} />
            <Features data={landingPageData.Features} />
            <About data={landingPageData.About} />
            <Services data={landingPageData.Services} />
            <Login setToken={setToken} />
            <Signup data={landingPageData.Testimonials} />
            <Contact />
          </>
        } />
        <Route path="/dashboard" element={token ? <Dashboard token={token} /> : <Navigate to="/login" />}/>
        <Route path="/myBids" element={token ? <MyBids token={token} /> : <Navigate to="/login" />}/>
        <Route path="/profile" element={token ? <Profile token={token} /> : <Navigate to="/login" />}/>
        <Route path="/addItem" element={token ? <AddItem token={token} /> : <Navigate to="/login" />}/>
      </Routes>
    </Router>
  );
};

export default App;
