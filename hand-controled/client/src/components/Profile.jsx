import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthProvider";
import {
  getUsersLinkReqs,
  getUsersRobots,
  acceptLinkReq,
  denyLinkReq,
} from "../api/robots";

import { getProfileImg, removeRobot } from "../api/users";

import { ChangeProfileImg } from "./ChangeProfileImg";
import { ProfileImg } from "./ProfileImg";
import { SetRobotNickname } from "./SetRobotNickname";

import { useNavigate } from "react-router-dom";

import "../styles/Profile.css";

export const Profile = () => {
  const [image, SetImage] = useState(null);
  const { user, startPending, endPending, isPending } = useAuth();
  const [usersLinkReqs, setUsersLinkReqs] = useState([]);
  const [usersRobots, setUsersRobots] = useState([]);
  const [pendingRows, setPendingRows] = useState([]);
  const [isChangeProfileImgOpen, setIsChangeProfileImgOpen] = useState(false);
  const [isSetRobotNicknameOpen, setIsSetRobotNicknameOpen] = useState(false);
  const [robotMacAddress, setRobotMacAddress] = useState(null);
  const [robotNickname, setRobotNickname] = useState(null);
  const navigate = useNavigate();

  const linkReqHeaders = ["mac address", "accept/deny"];
  const connectedRobotHeaders = [
    "nickname",
    "mac address",
    "connect/disconnect",
  ];

  const fetchUsersLinkReqs = async () => {
    const data = await getUsersLinkReqs(user.username);
    setUsersLinkReqs(data?.usersLinkReqs ? data.usersLinkReqs : []);
  };

  const fetchUsersRobots = async () => {
    const robots = await getUsersRobots(user.username);
    setUsersRobots(robots ? robots : []);
  };
  const fetchProfileImg = async () => {
    const profileImg = await getProfileImg(user.username);
    SetImage(profileImg);
  };

  const fetchData = async () => {
    try {
      fetchUsersLinkReqs();
      fetchUsersRobots();
      fetchProfileImg();
    } catch (error) {
      console.log("Error fetching user link requests:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  

  const handleConnect = (macAddress, nickname) => navigate("/connect-to-robot", { state: { macAddress, nickname } });

  const handleRemoveRobot = async (macAddress) => {
    try {
      setPendingRows([...pendingRows, macAddress]);
      await removeRobot(macAddress);
      await fetchUsersRobots();
    } catch (error) {
      console.error("Error removing robot:", error);
    } finally {
      setPendingRows(pendingRows.filter((row) => row !== macAddress));
    }

    // logic to remove robot from usersRobots
  };

  const handleAcceptLinkReq = async (macAddress) => {
    try {
      setPendingRows([...pendingRows, macAddress]);
      await acceptLinkReq(user.username, macAddress);
      await fetchUsersRobots();
      await fetchUsersLinkReqs();
    } catch (error) {
      console.error("Error accepting link request:", error);
      // You might want to show an error message to the user here
    } finally {
      setPendingRows(pendingRows.filter((row) => row !== macAddress));
    }
  };

  const handleDenyLinkReq = async (macAddress) => {
    try {
      setPendingRows([...pendingRows, macAddress]);
      await denyLinkReq(user.username, macAddress);
      await fetchUsersLinkReqs();
    } catch (error) {
      console.error("Error denying link request:", error);
    } finally {
      setPendingRows(pendingRows.filter((row) => row !== macAddress));
    }
  };

  const handleSetRobotNickname = (macAddress, nickname) => {
    setRobotMacAddress(macAddress);
    nickname = nickname == "none" ? "" : nickname;
    setRobotNickname(nickname);
    setIsSetRobotNicknameOpen(true);
  };

  return (
    <>
      <ChangeProfileImg
        isOpen={isChangeProfileImgOpen}
        setIsOpen={setIsChangeProfileImgOpen}
      />
      <SetRobotNickname
        isOpen={isSetRobotNicknameOpen}
        setIsOpen={setIsSetRobotNicknameOpen}
        macAddress={robotMacAddress}
        oldNickname={robotNickname}
        onNicknameSet={fetchUsersRobots}
      />
      <div className="profile-container">
        <h1 className="profile-title">Profile</h1>
        <div className="headers">
          <span className="profile-image-container small-screen-hidden">
            <ProfileImg ProfileImg={image} placeholder="No profile image" />
            <button
              className="basic-btn"
              onClick={() => setIsChangeProfileImgOpen(true)}
            >
              change profile image
            </button>
          </span>
          <div className="profile-greeting">
            <h3>Hello, {user?.username}</h3>
            <div>
              what robot would you like to hand-control out of the selection?
            </div>
          </div>
        </div>

        <div className="table-container">
          <h4 className="table-title">connect to robot</h4>

          <ul className="table-headers">
            {connectedRobotHeaders.map((header, index) => (
              <li key={index} className={`table-header ${header === "mac address" ? "small-screen-hidden" : ""}`}>
                {header}
              </li>
            ))}
          </ul>
          <div className="table-body">
            {usersRobots.length > 0 &&
              usersRobots.map((robot, index) => (
                <li key={index}>
                  <span className="table-cell">{robot.nickname}</span>
                  <span className="table-cell small-screen-hidden">{robot.macAddress}</span>
                  <span
                    className={`table-cell ${
                      pendingRows.includes(robot.macAddress) ? "pending" : ""
                    }`}
                  >
                    <button
                      className="basic-btn accept-btn"
                      onClick={() => handleConnect(robot.macAddress, robot.nickname)}
                      disabled={pendingRows.includes(robot.macAddress)}
                    >
                      connect
                    </button>{" "}
                    /
                    <button
                      className="basic-btn deny-btn"
                      onClick={() => handleRemoveRobot(robot.macAddress)}
                      disabled={pendingRows.includes(robot.macAddress)}
                    >
                      Remove
                    </button>
                    <span className="small-screen-hidden">/</span>
                    <button
                      className="basic-btn basic-inverted-btn small-screen-hidden"
                      onClick={() => handleSetRobotNickname(robot.macAddress, robot.nickname)}
                    >
                      Set Nickname
                    </button>
                  </span>
                </li>
              ))}
          </div>
        </div>

        <div className="table-container">
          <h4 className="table-title">Link Requests</h4>

          <ul className="table-headers">
            {linkReqHeaders.map((header, index) => (
              <li key={index} className="table-header">
                {header}
              </li>
            ))}
          </ul>
          <div className="table-body">
            {usersLinkReqs.length > 0 &&
              usersLinkReqs.map((macAddress, index) => (
                <li key={index}>
                  <span className="table-cell">{macAddress}</span>
                  <span
                    className={`table-cell 
                    ${pendingRows.includes(macAddress) ? "pending" : ""}`}
                  >
                    <button
                      className="basic-btn accept-btn"
                      onClick={() => handleAcceptLinkReq(macAddress)}
                      disabled={pendingRows.includes(macAddress)}
                    >
                      accept
                    </button>
                    /
                    <button
                      className="basic-btn deny-btn"
                      onClick={() => handleDenyLinkReq(macAddress)}
                      disabled={pendingRows.includes(macAddress)}
                    >
                      deny
                    </button>
                  </span>
                </li>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};
