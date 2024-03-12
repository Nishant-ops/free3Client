import React, { useRef } from "react";
import "./Header.css";
import { FaBars, FaTimes, FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
function Header() {
  const navRef = useRef();

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };
  return (
    <div className="landing-page__wrapper">
      <header>
        <div>
          <Link to={"/"}>
            {" "}
            <h3 className="main-navigation__logo">Free3</h3>
          </Link>
          <nav ref={navRef}>
            <a href="#freelancers">For Freelancers</a>
            <Link to="/about">Why Free3</Link>
            <a href="#categories">Categories</a>
            <a href="#clients">for Clients</a>
            <a href="#contact">Contact Us</a>

            <button className="nav-btn nav-close-btn" onClick={showNavbar}>
              <FaTimes />
            </button>
          </nav>
        </div>
        <button className="nav-btn" onClick={showNavbar}>
          <FaBars />
        </button>
        <div className="login-singup-wrapper">
          <a href="/login" className="login-btn">
            Login
          </a>
          <a href="/signup" className="signup-btn">
            Sign Up
          </a>
        </div>
      </header>
    </div>
  );
}

export default Header;
