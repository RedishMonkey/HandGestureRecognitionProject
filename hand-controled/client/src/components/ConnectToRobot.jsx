import React, {useState} from 'react'
import { useLocation } from 'react-router-dom';
import { HandRec } from './HandRec';
import "../styles/ConnectToRobot.css"

export const ConnectToRobot = () => {
  const [robotDirection, setRobotDirection] = useState("up");
  const location = useLocation();
  const robotNickname = location?.state?.nickname ? location.state.nickname : "unset";
  const macAddress = location?.state?.macAddress;

  return (
    <div className="connect-to-robot-container">
        <div className="connect-to-robot-header">
            <h3>Connect to your robot: {robotNickname}</h3>
        </div>
        <div className="connect-to-robot-body">
            <HandRec macAddress={macAddress} />
        </div>
    </div>
  )
}
