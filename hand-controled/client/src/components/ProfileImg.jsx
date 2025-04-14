import React from "react";
import "../styles/ProfileImg.css";

export const ProfileImg = ({ProfileImg = null, placeholder = "No image"}) => {
  return (
    <div className="preview-container">
      {ProfileImg ? (
        <img src={ProfileImg} alt="Preview" className="preview-image" /> // adding the function of showing the image
      ) : (
        <div className="placeholder-image">
          <span>{placeholder}</span>
        </div>
      )}
    </div>
  );
};
