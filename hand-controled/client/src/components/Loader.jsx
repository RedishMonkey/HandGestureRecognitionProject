import React from "react";
import { LoaderCircle } from "lucide-react";
import "../styles/Loader.css";

export const Loader = () => {
  return (
    <div className="loader-container">
      <LoaderCircle className="loader-icon" size={24} />
      
      <p className="loader-text">Loading
      <span className="loading-dots">
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </span>
      </p>
    </div>
  );
};
