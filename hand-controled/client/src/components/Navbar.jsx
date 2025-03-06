import React from 'react'
import './Navbar.css'

export const Navbar = () => {
    const toggleMenu = () => {
        console.log("Menu toggled"); // Placeholder for functionality
    };
    
    const ShowBackground = () => {
        console.log("Background shown"); // Placeholder for functionality
    };
  
    return (
    <nav className="navbar">
        <a href="#" className="navbar-brand">Hand Control</a>
        <button className="navbar-toggler" onClick={toggleMenu}>☰</button>
        <ul className="navbar-nav">
            <li className="nav-item"><a href="index.html" className="nav-link">Home Page</a></li>
            <li id="signIn" className="nav-item"><a href="signIn.html" className="nav-link">Sign In</a></li>
            <li id="signUp" className="nav-item"><a href="signUp.html" className="nav-link">Sign Up</a></li>
            <li className="nav-item"><button onClick={ShowBackground}>Show Background</button></li>
            <li id="liveBtn" className="nav-item"><a href="seeLive.html" className="nav-link">See Live</a></li>
            <li id="logoutBtn" className="nav-item"><button>Logout</button></li>
        </ul>
    </nav>
  )
}
