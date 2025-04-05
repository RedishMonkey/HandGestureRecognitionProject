import React, { useState } from "react";
import { Modal } from "./Modal";
import "../styles/AuthForm.css";

export const AuthForm = ({ isOpen, setIsOpen }) => {
  const [authType, setAuthType] = useState("Login");

  const oppositeAuthType = authType === "Login" ? "Register" : "Login";

  const changeAuthType = () => {
    setAuthType(oppositeAuthType);
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={authType}
      onClose={() => setAuthType("Login")}
    >
      <div className="auth-container">

        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Enter your password" />
        </div>

        {authType === "Register" && (
          <>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm your password" />
            </div>
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Enter your name" />
            </div>
          </>
        )}

        <button className="auth-button">{authType}</button>

        <div className="auth-switch">
          <span>
            {authType === "Login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <a onClick={changeAuthType}>{oppositeAuthType}</a>
            {/* {console.log(oppositeAuthType())} */}
          </span>
        </div>
      </div>
    </Modal>
  );
};
