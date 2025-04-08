import React, { useState, useRef } from "react";
import { Modal } from "./Modal";
import "../styles/AuthForm.css";
import { signIn, signUp } from "../api/auth";
import { useAuth } from "./AuthProvider";

export const AuthForm = ({ isOpen, setIsOpen }) => {
  const [authType, setAuthType] = useState("Login");
  const [errorMessage, setErrorMessage] = useState("");
  
  const { setIsSignedIn } = useAuth();

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const emailRef = useRef(null);

  const oppositeAuthType = authType === "Login" ? "Register" : "Login";

  const changeAuthType = () => {
    setAuthType(oppositeAuthType);
    setErrorMessage(""); // Clear error message when switching auth type
  };

  const handleSubmit = async () => {
    setErrorMessage(""); // Clear any previous error messages
    
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const username = usernameRef.current?.value;
    
    try {
      let response;
      if(authType === "Login") {
        response = await signIn({ username, password });
      } else {
        if(password !== confirmPasswordRef.current?.value){
          setErrorMessage("Password and confirm password do not match");
          return;
        }
        response = await signUp({ email, password, username });
      }
      console.log(response);
      if (response.success) {
        setIsSignedIn(true);
        setIsOpen(false);
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      // console.log(error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={authType}
      onClose={() => {
        setAuthType("Login");
        setErrorMessage("");
      }}
    >
      <div className="auth-container">
        <div className="form-group">
          <label>Username</label>
          <input type="text" ref={usernameRef} placeholder="Enter your username" />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" ref={passwordRef} placeholder="Enter your password" />
        </div>

        {authType === "Register" && (
          <>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" ref={confirmPasswordRef} placeholder="Confirm your password" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="text" ref={emailRef} placeholder="Enter your email" />
            </div>
          </>
        )}

        <button className="auth-button" onClick={handleSubmit}>{authType}</button>

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        <div className="auth-switch">
          <span>
            {authType === "Login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <a onClick={changeAuthType}>{oppositeAuthType}</a>
          </span>
        </div>
      </div>
    </Modal>
  );
};
