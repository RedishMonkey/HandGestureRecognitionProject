import React, { useRef } from "react";
import { Modal } from "./Modal";

import { setRobotNickname } from "../api/users";

import "../styles/SetRobotNickname.css";

export const SetRobotNickname = ({ isOpen, setIsOpen, macAddress, oldNickname="", onNicknameSet }) => {
  const nicknameRef = useRef(null);


  const handleSetNickname = async () => {
    try {
      const nickname = nicknameRef.current.value;
      await setRobotNickname(macAddress, nickname);
      setIsOpen(false);

      onNicknameSet();
    } catch (error) {
      console.log("an error occurred: ", error);
    }
  };
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Set Robot Nickname">
      <div className="set-robot-nickname-container">
        <h3>new robot nickname</h3>
        <input type="text" ref={nicknameRef} defaultValue={oldNickname} />
        <button className="basic-btn" onClick={handleSetNickname}>
          set nickname
        </button>
      </div>
    </Modal>
  );
};
