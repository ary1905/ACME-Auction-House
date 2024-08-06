import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from '../assets/images/Logo.png';
import '../assets/css/navigation.css';

export const Navigation = ({ token, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/');

    setTimeout(() => {
      window.location.hash = '#page-top';
    }, 0);
  };

  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>

          <a className="navbar-brand page-scroll" href="#page-top">
            <img src={Logo} alt="webisteLogo" style={{ height: "45px", marginTop: "-10px" }} />
          </a>
        </div>

        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav navbar-right">
            {!token ? (
              <>
                <li>
                  <a href="#features" className="page-scroll">
                    Categories
                  </a>
                </li>
                <li>
                  <a href="#about" className="page-scroll">
                    About
                  </a>
                </li>
                <li>
                  <a href="#services" className="page-scroll">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#login" className="page-scroll">
                    Login
                  </a>
                </li>
                <li>
                  <a href="#signup" className="page-scroll">
                    Sign Up
                  </a>
                </li>
                <li>
                  <a href="#contact" className="page-scroll">
                    Contact Us
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/dashboard" className="page-scroll">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/myBids">
                    My Bids
                  </Link>
                </li>
                <li>
                  <Link to="/addItem">
                    Add Item
                  </Link>
                </li>
                <li>
                  <Link to="/profile">
                    <i className="fa fa-user fa-lg" aria-hidden="true" style={{marginRight:'5px'}}></i>Profile
                  </Link>
                </li>
                <li>
                  <a onClick={handleLogout} style={{ cursor: 'pointer' }} href="#page-top">
                    Logout
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
