import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

import { AuthForm } from "./AuthForm";

import { signOut, me } from "../api/auth";
import { useAuth } from "./AuthProvider";

import logo from "../assets/images/small-logo-white.png";

export const Navbar = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);
  const { isSignedIn, setIsSignedIn } = useAuth();

  const toggleMenu = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const getAuthState = () => {
    console.log(authState);
  }
  
  // const doSignIn = () => {
  //   setIsSignedIn(true);
  //   signIn({username: "test", password: "test"});
  // }

  return (
    <nav className="navbar">
      <AuthForm isOpen={isAuthFormOpen} setIsOpen={setIsAuthFormOpen} />

      <li className="nav-logo">
        <NavLink to="/">
          <img className="logo" src={logo} alt="hand controlled" />
        </NavLink>
      </li>

      <ul className={`nav-menu ${isNavbarOpen ? "active" : ""}`}>
        <li>
          <div className="nav-item"></div>
        </li>
        <li className="nav-item">
          <NavLink to="/">Home</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/about">About</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/contact" >Contact</NavLink>
        </li>
        {!isSignedIn && <li className="nav-item auth-btn" onClick={() => setIsAuthFormOpen(!isAuthFormOpen)}>Login</li>}
        {isSignedIn && <li className="nav-item auth-btn" onClick={signOut}>Signout</li>}
      </ul>

      <button
        className={`hamburger ${isNavbarOpen ? "active" : ""}`}
        onClick={toggleMenu}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
    </nav>
  );
};
