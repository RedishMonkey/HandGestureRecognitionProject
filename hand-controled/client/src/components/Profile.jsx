import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthProvider";
import {
  getUsersLinkReqs,
  getUsersRobots,
  acceptLinkReq,
  denyLinkReq,
} from "../api/robots";

import "../styles/Profile.css";

export const Profile = () => {
  const [image, SetImage] = useState(null);
  const { user, startPending, endPending, isPending } = useAuth();
  const [usersLinkReqs, setUsersLinkReqs] = useState([]);
  const [usersRobots, setUsersRobots] = useState([]);
  const [pendingRows, setPendingRows] = useState([]);


  
  const linkReqHeaders = ["mac address", "accept/deny"];
  const connectedRobotHeaders = [
    "nickname",
    "mac address",
    "connect/disconnect",
  ];

  const fetchData = async () => {
    try {
      const data = await getUsersLinkReqs(user.username);
      setUsersLinkReqs(data.usersLinkReqs ? data.usersLinkReqs : []);
      const robots = await getUsersRobots(user.username);
      setUsersRobots(robots ? robots : []);
    } catch (error) {
      console.log("Error fetching user link requests:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Only depend on user and isPending

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      SetImage(file);
    }
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result;
      SetImage(base64String);
      console.log(base64String);
    };
    reader.onerror = (error) => {
      console.error("Error reading image:", error);
    };

    reader.readAsDataURL(file);
  };

  const handleConnect = (macAddress) => {
    console.log("connect to robot: ", macAddress);
  };

  const handleDisconnect = (macAddress) => {
    console.log("disconnect from robot: ", macAddress);
  };

  const handleAcceptLinkReq = async (macAddress) => {
    try {
      setPendingRows([...pendingRows, macAddress]);
      await acceptLinkReq(user.username, macAddress);
      await fetchData();
    } catch (error) {
      console.error("Error accepting link request:", error);
      // You might want to show an error message to the user here
    } finally {
      setPendingRows(pendingRows.filter(row => row !== macAddress));
    }
  };

  const handleDenyLinkReq = async (macAddress) => {
    try {
      setPendingRows([...pendingRows, macAddress]);
      await denyLinkReq(user.username, macAddress);
      await fetchData();
    } catch (error) {
      console.error("Error denying link request:", error);
      // You might want to show an error message to the user here
    } finally {
      setPendingRows(pendingRows.filter(row => row !== macAddress));
    }
  };

  return (
    <>
      <div className="profile-container">
        <h1 className="profile-title">Profile</h1>
        <div className="headers">
          <span className="profile-image-container">
            <img src={image} alt="Profile image" />
            <button className="basic-btn">change profile image</button>
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
              <li key={index} className="table-header">
                {header}
              </li>
            ))}
          </ul>
          <div className="table-body">
            {usersRobots.length > 0 &&
              usersRobots.map((robot, index) => (
                <li key={index}>
                  <span className="table-cell">{robot.nickname}</span>
                  <span className="table-cell">{robot.macAddress}</span>
                  <span className="table-cell">
                    <button className="basic-btn accept-btn">connect</button> /
                    <button className="basic-btn deny-btn">disconnect</button>
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
                  <span className={`table-cell 
                    ${pendingRows.includes(macAddress) ? "pending" : ""}`} >
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
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
    </>
  );
};
