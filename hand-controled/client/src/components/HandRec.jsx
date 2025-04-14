import React, { useEffect, useRef, useState } from "react";
import {
  HandLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

import { setRobotState } from "../api/users";

import "../styles/HandRec.css";

export const HandRec = ({ macAddress }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const directionRef = useRef(null);
  const enableWebcamRef = useRef(false);
  const [handLandmarker, setHandLandmarker] = useState(null);
  const liveDivRef = useRef(null);
  let frameCounter = 0;
  let direction = "no hand detected";
  let isWebcamEnabled = false;
  let lastDirection = "stop";
  let lastTimeSetState = 0;

  useEffect(() => {
    const loadModel = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );

      const landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
      });

      setHandLandmarker(landmarker);
    };

    loadModel();
  }, []);

  const toggleWebcamBtn = () => {
    isWebcamEnabled = !isWebcamEnabled;
    if (isWebcamEnabled) {
      enableWebcamRef.current.className = "basic-btn neg-btn";
      enableWebcamRef.current.textContent = "Disable Webcam";
    } else {
      enableWebcamRef.current.className = "basic-btn pos-btn";
      enableWebcamRef.current.textContent = "Enable Webcam";
    }
  };
  // const drawCircle = (ctx, x, y, radius) => {
  //   ctx.beginPath();
  //   ctx.lineWidth = 6;
  //   ctx.arc(x, y, radius, 0, 2 * Math.PI);
  //   ctx.fillStyle = "red";
  //   ctx.fill();
  // };

  // Function to draw an arrow between two points on a canvas context
  const drawArrow = (ctx, fromX, fromY, toX, toY) => {
    const lineWidth = 3;

    // Draw the main line of the arrow
    ctx.beginPath(); // Start a new path
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "yellow";
    ctx.moveTo(fromX, fromY); // Move to start point
    ctx.lineTo(toX, toY); // Draw line to end point
    ctx.stroke();

    // Draw the arrow head
    // Define the length of the arrow head in pixels
    const headLength = 40;
    // Calculate the angle of the line in radians
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "red";
    ctx.moveTo(toX, toY); // Move to arrow tip
    ctx.lineTo(
      // Draw first line of arrow head
      toX - headLength * Math.cos(angle - Math.PI / 6), // Calculate x coordinate
      toY - headLength * Math.sin(angle - Math.PI / 6) // Calculate y coordinate
    );

    ctx.moveTo(toX, toY);
    ctx.lineTo(
      // Draw second line of arrow head
      toX - headLength * Math.cos(angle + Math.PI / 6), // Calculate x coordinate
      toY - headLength * Math.sin(angle + Math.PI / 6) // Calculate y coordinate
    );
    ctx.stroke();
  };


  const enableWebcam = async () => {
    if (!handLandmarker) {
      console.warn("Model not loaded yet.");
      return;
    }

    toggleWebcamBtn();

    if (!isWebcamEnabled) {
      const tracks = videoRef.current.srcObject?.getTracks() || [];
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      liveDivRef.current.style.display = "none";
      lastTimeSetState = 0;
      lastDirection = "stop";
      return;
    }

    liveDivRef.current.style.display = "block";
    liveDivRef.current.style.position = "relative";

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
        },
      });

      videoRef.current.srcObject = stream;

      videoRef.current.play();

      requestAnimationFrame(webcamLoop);
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const webcamLoop = async () => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      !handLandmarker ||
      !isWebcamEnabled
    )
      return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Skip if video isn't ready
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      requestAnimationFrame(webcamLoop);
      return;
    }

    // Set canvas dimensions to match video
    if (
      canvas.width !== video.videoWidth ||
      canvas.height !== video.videoHeight
    ) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    try {
      if (frameCounter % 2 === 1) {
        frameCounter = 0;
        requestAnimationFrame(webcamLoop);
        return;
      }
      frameCounter++;

      const results = handLandmarker.detectForVideo(video, performance.now());

      const landmarks =
        results.landmarks.length > 0 ? results.landmarks?.[0] : null;
      const indexFingerLandmarks = landmarks
        ? {
            x: landmarks?.[8]?.x * canvas.width,
            y: landmarks?.[8]?.y * canvas.height,
          }
        : null;
      const thumbLandmarks = landmarks
        ? {
            x: landmarks?.[4]?.x * canvas.width,
            y: landmarks?.[4]?.y * canvas.height,
          }
        : null;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Save the current context state
      ctx.save();

      // Apply transformations
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);

      // Draw the video
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);


      //   Draw the circle (after transformations)
      if (landmarks)
        drawArrow(
          ctx,
          thumbLandmarks.x,
          thumbLandmarks.y,
          indexFingerLandmarks.x,
          indexFingerLandmarks.y
        );

      // Restore the context state
      ctx.restore();

      if (landmarks) {
        const radians = Math.atan2(
          indexFingerLandmarks.y - thumbLandmarks.y,
          thumbLandmarks.x - indexFingerLandmarks.x
        );
        const angle = radians * (180 / Math.PI) + 180;
        if ((angle > 315 && angle < 360) || (angle > 0 && angle < 45))
          direction = "left";
        else if (angle > 45 && angle < 135) direction = "forward";
        else if (angle > 135 && angle < 225) direction = "right";
        else if (angle > 225 && angle < 315) direction = "backward";
      } else direction = "stop";


      directionRef.current.textContent = direction === "stop" ? "no hand detected" : `direction: ${direction}`;
      
      if(direction !== lastDirection || (video.currentTime - lastTimeSetState) > 0.25){
        lastDirection = direction;
        lastTimeSetState = video.currentTime;
        setRobotState(macAddress, direction);
      }
    } catch (err) {
      console.error("Error processing video frame:", err);
    }

    requestAnimationFrame(webcamLoop);
  };

  return (
    <div className="hand-rec-container">
      <button
        ref={enableWebcamRef}
        className="basic-btn pos-btn"
        onClick={enableWebcam}
      >
        Enable Webcam
      </button>
      <div ref={liveDivRef} style={{ display: "none" }}>
        <video ref={videoRef} style={{ display: "none" }} />
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
        <p
          ref={directionRef}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            color: "white",
          }}
        >dlfjsd</p>
      </div>
    </div>
  );
};
