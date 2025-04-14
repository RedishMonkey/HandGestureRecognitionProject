import React from "react";
import { Modal } from "./Modal";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { setProfileImg } from "../api/users";
import { ProfileImg } from "./ProfileImg";

import "../styles/ChangeProfileImg.css";

export const ChangeProfileImg = ({ isOpen, setIsOpen }) => {
  const [proccessedFile, setProccessedFile] = useState(null);
  const { startPending, endPending } = useAuth();

  const handleFileChange = (e) => {
    const file = e?.target?.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // const webpString = str2webpstr(reader.result, convertFrom, "-q 80");
        setProccessedFile(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    startPending();
    await setProfileImg(proccessedFile);
    setIsOpen(false);
    setProccessedFile(null);
    endPending();
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={"Change your profile image"}
      onClose={() => {
        setProccessedFile(null);
      }}
    >
      <div className="change-profile-image-container">
        <ProfileImg
          ProfileImg={proccessedFile}
          placeholder="No image selected"
          style={{ width: "200px", height: "200px" }}
        />

        <div className="file-input-container">
          <label htmlFor="profile-image-input" className="file-input-label">
            Choose Image
          </label>
          <input
            id="profile-image-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        <button
          className="upload-button"
          disabled={!proccessedFile}
          onClick={handleSubmit}
        >
          Upload Image
        </button>
      </div>
    </Modal>
  );
};
