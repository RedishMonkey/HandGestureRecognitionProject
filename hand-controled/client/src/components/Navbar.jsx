import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

import { AuthForm } from "./AuthForm";

import { signOut} from "../api/auth";
import { useAuth } from "./AuthProvider";

import logo from "../assets/images/small-logo-white.png";

export const Navbar = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);
  const { isSignedIn, startPending, endPending } = useAuth();

  const toggleMenu = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };


  
  const doSignOut = async () => {
    startPending();
    await signOut();
    setIsNavbarOpen(false);
    endPending();
  }

  return (
    <nav className="navbar">
      <AuthForm isOpen={isAuthFormOpen} setIsOpen={setIsAuthFormOpen} />

      <li className="nav-logo">
        <NavLink to="/" onClick={() => setIsNavbarOpen(!isNavbarOpen)}>
          <img className="logo" src={logo} alt="hand controlled" />
        </NavLink>
      </li>

      <ul className={`nav-menu ${isNavbarOpen ? "active" : ""}`}>
        <li>
          <div className="nav-item" onClick={() => setIsNavbarOpen(!isNavbarOpen)}></div>
        </li>
        <li className="nav-item">
          <NavLink to="/" onClick={() => setIsNavbarOpen(false)}>Home</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/about" onClick={() => setIsNavbarOpen(false)}>About</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/contact" onClick={() => setIsNavbarOpen(false)}>Contact</NavLink>
        </li>
        {!isSignedIn && <li className="nav-item auth-btn" onClick={() => setIsAuthFormOpen(!isAuthFormOpen)}>Login</li>}
        {isSignedIn && <li className="nav-item"> <NavLink to="/profile" onClick={() => setIsNavbarOpen(false)}>Profile</NavLink></li>}
        {isSignedIn && <li className="nav-item auth-btn" onClick={doSignOut}>Signout</li>}
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
