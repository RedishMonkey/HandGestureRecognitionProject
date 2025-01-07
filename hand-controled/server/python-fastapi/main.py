from fastapi import FastAPI, Path, Query, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from typing import Optional
from pydantic import BaseModel
import numpy as np
import cv2
from utils.HandGestureRecognitionCode.handRecLibs import utils
import asyncio
import queue # queue is a multi threading package foor queue
import threading





app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

hand_req_frame_queue = asyncio.Queue(maxsize=10)

#has in it the values to apdate to last_gesture
closeFastAPI = False

gestsFileName = "gestures.csv"
utils.NoEmptyDatabase(gestsFileName)

gesturesNames,gesturesData = utils.GetGesturesArr(gestsFileName)


import firebase_admin
from firebase_admin import credentials, db

# setups before running code
cred = credentials.Certificate("firebaseCertificate.json")
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://hand-recognition-a7ca9-default-rtdb.europe-west1.firebasedatabase.app/"
})

# update information to database
ref = db.reference("gesture")  # Adjust the reference path to your database structure

lastGesture = None

class Image(BaseModel):
    imageId: int
    data: int






@app.get("/")
def root():
    return {"state": "server is running"}


frameCount = 1
proccessEveryFrames = 2

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    while True:
        try:
            # Receive binary image data
            binary_data = await websocket.receive_bytes()
            
            # Convert binary data to numpy array
            image_array = np.frombuffer(binary_data, dtype=np.uint8)
            
            # Decode the image using OpenCV
            frm = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
            
            if frm is None:
                print("Failed to decode image.")
                await websocket.send_text("Failed to decode image.")
                continue
            

            
            global frameCount, proccessEveryFrames

            if frameCount % proccessEveryFrames == 0:
                frameCount = 1
                height ,width =  frm.shape[:2]
                handsLandmarks =  utils.GetHandsLandmarks(frm,height,width)
                for hand in handsLandmarks:
                    utils.DrawHand(frm, hand)
                    matchIndex = utils.GetGestureMatch(gesturesData, handsLandmarks[0])


                    gestureName = gesturesNames[matchIndex]
                    
                    if gestureName != getLastGesture():
                        thread =  threading.Thread(target=update_firebase,kwargs={"last_gesture":gestureName}, daemon=True)
                        thread.start()



                
                # Display the image
                cv2.imshow("Received Image", frm)
                if not hand_req_frame_queue.full():
                    await hand_req_frame_queue.put(frm)
            else:
                frameCount += 1

            if cv2.waitKey(1) == ord("q"):
                break
        
        except WebSocketDisconnect:
            print("client disconnected")
            break

        except Exception as e:
            print(f"Connection error: {e}")
            break
    
    # Gracefully close the connection
    await websocket.close()
    print("WebSocket connection closed.")
    cv2.destroyAllWindows()


@app.get("/stream-images")
async def stream_images():
    """
    Endpoint to continuously stream images as a video-like stream.
    """
    
    async def image_stream():
        while True:
            try:
                # Encode the current frame as a PNG
                frame = await hand_req_frame_queue.get()

                # un/comment this to send .jpg images (less computationally taxing than .png)
                success, buffer = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 60])

                # un/comment this to send .png images (more computationally taxing than .jpg)
                #success, buffer = cv2.imencode('.png', frame)
                if not success:
                    continue

                # Yield the frame as part of the multipart stream
                yield (
                    b"--frame\r\n"
                    b"Content-Type: image/jpeg\r\n\r\n" +
                    buffer.tobytes() +
                    b"\r\n"
                )
            
            except asyncio.CancelledError:
                print("client disconnected")
                break # exit the generator gracefully


    return StreamingResponse(image_stream(), media_type="multipart/x-mixed-replace; boundary=frame")

def update_firebase(last_gesture):
    ref.set({"last_gesture":last_gesture})
    SetLastGesture(last_gesture)


lock = threading.Lock()

def getLastGesture():
    global lastGesture
    with lock:
        return lastGesture

def SetLastGesture(newLastGesture):
    global lastGesture
    with lock:
        lastGesture = newLastGesture
