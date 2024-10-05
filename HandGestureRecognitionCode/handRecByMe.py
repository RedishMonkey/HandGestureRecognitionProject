import numpy as np
import cv2
from datetime import datetime
import handRecLibs.utils as utils
import handRecLibs.runingFuncs as runFunc




cap =  cv2.VideoCapture(0)

gestsFileName = "gestures.csv"
utils.NoEmptyDatabase(gestsFileName)

gesturesNames,gesturesData = utils.GetGesturesArr(gestsFileName)

# gets frame height and width
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))

currentTime = datetime.now()
lastFrmTime = currentTime.time().microsecond
CurrFrmTime = currentTime.time().microsecond



key = cv2.waitKey(0)

while key != ord('q'):

    frm = np.zeros((height,width,3), dtype = np.uint8)
    frm = cv2.UMat(frm)    
    cv2.putText(frm, f"choose a mode",(10,40),cv2.FONT_HERSHEY_PLAIN,2,(255,255,255),2,cv2.LINE_AA)
    cv2.putText(frm, f"recognition mode - press r",(10,120),cv2.FONT_HERSHEY_PLAIN,2,(255,255,255),2,cv2.LINE_8)
    cv2.putText(frm, f"save mode - press s",(10,160),cv2.FONT_HERSHEY_PLAIN,2,(255,255,255),2,cv2.LINE_8)
    cv2.putText(frm, f"deletion mode - press d",(10,200),cv2.FONT_HERSHEY_PLAIN,2,(255,255,255),2,cv2.LINE_8)
    cv2.putText(frm, f"to quite - press q",(10,240),cv2.FONT_HERSHEY_PLAIN,2,(255,255,255),2,cv2.LINE_8)

    
    if key == ord('r'):
        runFunc.HandRecRunning(cap, gestsFileName)
    
    elif key == ord('s'):
        runFunc.saveGesturesRuning(cap, gestsFileName)
    
    elif key == ord('d'):
        runFunc.DeleteGesturesRunning(cap, gestsFileName)


    cv2.imshow('frame',frm)
    
    key = cv2.waitKey(1)





cap.release()
cv2.destroyAllWindows()