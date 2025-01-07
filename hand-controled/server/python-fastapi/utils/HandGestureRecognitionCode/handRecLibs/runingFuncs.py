import numpy as np
import cv2
from datetime import datetime
import handRecLibs.utils as utils
import math

print("hii")


def saveGesturesRuning(cap, gestsFileName):
    # gets frame height and width
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    key = cv2.waitKey(1)
    

    while True:
        ret,frm = cap.read()
    
        if not ret:
            break
    

        handsLandmarksList = []
        handsLandmarksList = utils.GetHandsLandmarks(frm, height,width)

        frm[:,:] = [0,0,0]
    
        for hand in handsLandmarksList:
            hand = np.subtract(hand,hand[0])
            hand = np.add(hand,[height*0.8,width*0.5])
            hand = np.floor(hand)
            hand = np.astype(hand, np.int16)


            if(key == ord('s')):
                headerPlacement = (math.floor(width*0.1), math.floor(height*0.2))
                textPlacement = (math.floor(width*0.1), math.floor(height*0.4))
                exitPlacement = (10, math.floor(height*0.8))
                gestName = ""

                frm[:,:] = [0,0,0]
                cv2.putText(frm,f"give a name to the gesture",headerPlacement,cv2.FONT_HERSHEY_PLAIN,1.5,(255,255,255),2,cv2.LINE_AA)
                cv2.putText(frm,f"gesture name: {gestName}",textPlacement,cv2.FONT_HERSHEY_PLAIN,1.5,(255,255,255),2,cv2.LINE_AA)
                cv2.putText(frm,f"to exit - press q",exitPlacement,cv2.FONT_HERSHEY_PLAIN,1.5,(255,255,255),2,cv2.LINE_AA)
                cv2.imshow("frame", frm)

                key = cv2.waitKey(0)
                while key != ord('\r'): #the special character \r represents the enter button
                    if key == ord('\b'): # the special character \b represents backspace
                        gestName= gestName[:-1]
                    elif key == ord('q'):
                        break
                    else:
                        gestName = gestName + chr(key)
                

                    frm[:,:] = [0,0,0]
                    cv2.putText(frm,f"give a name to the gesture",headerPlacement,cv2.FONT_HERSHEY_PLAIN,1.5,(255,255,255),2,cv2.LINE_AA)
                    cv2.putText(frm,f"gesture name: {gestName}",textPlacement,cv2.FONT_HERSHEY_PLAIN,1.5,(255,255,255),2,cv2.LINE_AA)
                    cv2.putText(frm,f"to exit - press q",exitPlacement,cv2.FONT_HERSHEY_PLAIN,1.5,(255,255,255),2,cv2.LINE_AA)
                    cv2.imshow("frame", frm)
                    key = cv2.waitKey(0)
            
                if key != ord('q'):
                    utils.AddGesture(gestsFileName, gestName, hand)
            
            utils.DrawHand(frm, hand)

        cv2.imshow('frame',frm)
        key = cv2.waitKey(1)
        if key == ord('q'):
            break


def HandRecRunning(cap, gestsFileName):
    
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))

    currentTime = datetime.now()
    lastFrmTime = currentTime.time().microsecond
    CurrFrmTime = currentTime.time().microsecond

    while True:
        ret,frm = cap.read()
    
        if not ret:
            break

        handsLandmarksList = []
        handsLandmarksList = utils.GetHandsLandmarks(frm,height,width)

        for hand in handsLandmarksList:

            normalizedHand = utils.NormalizeData(hand)
            gesturesNames,gesturesData = utils.GetGesturesArr(gestsFileName)
            matchIndex = utils.GetGestureMatch(gesturesData,hand) 
            i = 0
            # for i in range(len(gesturesNames)):
            #     percent = utils.CheckMatchPercent(gesturesData[i],normalizedHand)
            #     percent = (math.floor(percent*(10**4)))/(10**4)
            #     cv2.putText(frm,f"{gesturesNames[i]} match percent: {percent}",(0,i*30+60),cv2.FONT_HERSHEY_PLAIN,1.5,(255,255,255),2,cv2.LINE_AA)
        
        
           
            cv2.putText(frm,f"match gesture name: {gesturesNames[matchIndex]}",(0,(i + 1)*30 + 60),cv2.FONT_HERSHEY_PLAIN,1.5,(255,255,255),2,cv2.LINE_AA)
            utils.DrawHand(frm, hand)
            utils.DrawHandRectangle(frm, hand, gesturesNames[matchIndex])
            
        # calculates fps
        CurrFrmTime = datetime.now().time().microsecond
        timDiff = CurrFrmTime - lastFrmTime
        lastFrmTime = CurrFrmTime

        fps = 1000000 / timDiff
        fps = math.floor(fps)

        # draws the fps
        cv2.putText(frm,f"frame rate: {fps}",(0,30),cv2.FONT_HERSHEY_PLAIN,3,(255,255,255),5,cv2.LINE_AA)

        cv2.imshow('frame',frm)

    
    

        if cv2.waitKey(1) == ord('q'):
            break


def DeleteGesturesRunning(cap, gestsFileName):
    # gets frame height and width
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    key = cv2.waitKey(1)
    gesturesNames,gesturesData = utils.GetGesturesArr(gestsFileName)


    key = ""
    
    while True:
        ret,frm = cap.read()

        if not ret:
            break
    

        databaseData = utils.GetDatabaseCSV(gestsFileName)

        frm[:,:] = [0,0,0]



        if len(databaseData[0]) == 1: #if empty then:
            noGestsTxtPlacement = (width*0.2, height*0.5)
            noGestsTxtPlacement = np.floor(noGestsTxtPlacement)
            noGestsTxtPlacement = np.asarray(noGestsTxtPlacement,dtype=np.int16)
            cv2.putText(frm,f"you have no gestures saved",noGestsTxtPlacement,cv2.FONT_HERSHEY_PLAIN,1.5,(255,255,255),2,cv2.LINE_AA)
            cv2.imshow('frame', frm)
            key = cv2.waitKey(0)
        

        else:
            headerPos = (10, 30)
            headerPos = np.floor(headerPos)
            headerPos = np.asarray(headerPos, dtype=np.int16)
            cv2.putText(frm,f"choose a gesture out of the ones u have",headerPos,cv2.FONT_HERSHEY_PLAIN,1.5,(255,255,255),2,cv2.LINE_AA)

            
            numberOfGestsToPrint = 5
            if numberOfGestsToPrint > len(databaseData[0]):
                numberOfGestsToPrint = len(databaseData[0])

            for i in range(numberOfGestsToPrint):
                gestNamePos = (10 ,i*30 + 60)
                gestToDelPos = (math.floor(width * 0.3), math.floor(height * 0.4))
                exitPlacement = (10, math.floor(height*0.8))
                gestToDelete = ""


                cv2.putText(frm,databaseData[0][i],gestNamePos,cv2.FONT_HERSHEY_PLAIN,1.5,(255,255,255),2,cv2.LINE_AA)
                cv2.putText(frm,f"gesture to delete: {gestToDelete}",gestToDelPos,cv2.FONT_HERSHEY_PLAIN,1.5,(255,255,255),2,cv2.LINE_AA)
                cv2.putText(frm,f"to exit - press q",exitPlacement,cv2.FONT_HERSHEY_PLAIN,1.5,(255,255,255),2,cv2.LINE_AA)
                
                
            cv2.imshow("frame", frm)

            key = cv2.waitKey(0)
            while key != ord('\r'): #the special character \r represents the enter button
                if key == ord('\b'): # the special character \b represents backspace
                    gestToDelete= gestToDelete[:-1]
                elif key == ord('q'):
                    break
                else:
                    gestToDelete = gestToDelete + chr(key)
            

                frm[:,:] = [0,0,0]
                
                numberOfGestsToPrint = 5
                if numberOfGestsToPrint > len(databaseData[0]):
                    numberOfGestsToPrint = len(databaseData[0])

                for i in range(numberOfGestsToPrint):
                    gestNamePos = (10 ,i*30 + 60)
                    
                    cv2.putText(frm,f"choose a gesture out of the ones u have",headerPos,cv2.FONT_HERSHEY_PLAIN,1.5,(255,255,255),2,cv2.LINE_AA)
                    cv2.putText(frm,databaseData[0][i],gestNamePos,cv2.FONT_HERSHEY_PLAIN,1.5,(255,255,255),2,cv2.LINE_AA)
                    cv2.putText(frm,f"gesture to delete: {gestToDelete}",gestToDelPos,cv2.FONT_HERSHEY_PLAIN,1.5,(255,255,255),2,cv2.LINE_AA)
                    cv2.putText(frm,f"to exit - press q",exitPlacement,cv2.FONT_HERSHEY_PLAIN,1.5,(255,255,255),2,cv2.LINE_AA)
                        
                cv2.imshow("frame", frm)

                key = cv2.waitKey(0)

                if key == ord('\r'):
                    utils.DeleteGest(gestsFileName, gestToDelete)
                    
            

        cv2.imshow('frame',frm)
        
        if key == ord('q'):
            break



                