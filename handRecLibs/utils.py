import numpy as np
import cv2
import math
import csv
import mediapipe as mp

handsRecFunctionMP = mp.solutions.hands.Hands(
    # in not static image mode firstly finds a hand once and 
    # then tracks it because hand tracking is less heavy than hand detection
    static_image_mode = False, 
    max_num_hands = 2,
    min_detection_confidence = 0.5,
    min_tracking_confidence = 0.8
)

#checks if the data base given is empty and if it is then fills it
def NoEmptyDatabase(fileName):

    Database = GetDatabaseCSV(fileName)

    if not Database:
        firstArr = np.ones((20,2),dtype = np.float32)
        firstArr = np.append(firstArr,[(0, 0)], axis = 0) # all of the x and all of the y values cant be the same for the normalization to work
        AddGesture(fileName, "first gesture", firstArr)



def GetDatabaseCSV(fileName):
    databaseArr = []
    with open(fileName,'r') as file:
        databaseArr = list(csv.reader(file))

    return databaseArr

def GetHandsLandmarks(frm, height, width):
    
    results = handsRecFunctionMP.process(frm)
    handsLandmarksList = []
    

    if results.multi_hand_landmarks:
        for handLandmarks in results.multi_hand_landmarks:
            handsLandmarksList.append(convLandmarkToList(handLandmarks, width, height))
    
    return handsLandmarksList



def convLandmarkToList(handLandmarks, frmWidth, frmHeight):
    """
    description: gets a list of hand landmarks of the type handLandmarkList for 
    multiple hands and converts it into an array of hand landmarks for multiple hands
    shape: (handsCount,21,2) 
    yPos: the first item in the array
    xPos:  the second item in the array
    
    @handLandmarks : list of hand landmarks gotten from the mediapipe library
    @frmWidth : the width of the frame
    @frmHeight : the height of the frame
    """
    handLandmarkList = []
    
    for i in range(21):
        landmark = handLandmarks.landmark[i]
        handLandmarkList.append((int(landmark.y * frmHeight),int(landmark.x * frmWidth)))

    return handLandmarkList

def GetLowHighCoor(hand):
    """
    description: gets coordinates of a hand and returns the heighest xy coordinates 
    and lowest xy coordinates

    return: [(minY,minX),(maxX,maxY)]

    @hand : landmarks for one hand
    """
    maxX = hand[0][1] # hand[0][1] is the first x pos
    maxY = hand[0][0] # hand[0][0] is the first y pos
    minX = hand[0][1]
    minY = hand[0][0]
    for i in range(21):
        if hand[i][0] > maxY:
            maxY = hand[i][0]
        
        if hand[i][0] < minY:
            minY = hand[i][0]

        if hand[i][1] > maxX:
            maxX = hand[i][1]
        
        if hand[i][1] < minX:
            minX = hand[i][1]
        
    return [(minY,minX),(maxY,maxX)]



def FlipXYPos(coordinate):
    """
    description: flips the positions of x and y in the coordinates

    @coordinate : a coordinate where one poistion is x and the other is y
    """
    return (coordinate[1],coordinate[0])

def CutRectangle(frm, minX, minY, maxX ,maxY):
    """
    returns a copy of the rectangle that the points [minY,minX] and [maxY,maxX] create
    where [minY,minX] is the top left corner and [maxY,maxX] is the bottom right corner
    of the rectangle

    frm: the image to cut the rectangle from
    minX: minimum value of x in the rectangle
    minY: minimum value of y in the rectangle
    maxX: maximum value of x in the rectangle
    maxY: maximum value of y in the rectangle

    returns: array of shape (maxY-minY,maxX-minX,3) that represents an image
    """
    newFrm = (frm[minY:maxY+1,minX:maxX+1]).copy()
    newFrm = cv2.UMat(newFrm)
    return newFrm

def DrawHand(frm, hand):
    '''
    description: draws a hand hon the image given

    frm: an array that represents an image or a frame
    hand: an array of hand landmarks
    notice!! a landmark is ordered like this: [yPos, xpos]
    '''

    # drawing landmarks
    for landmark in hand:
        cv2.circle(frm, FlipXYPos(landmark),6, (0,0,255), -1)

        # drawing lines between landmarks
        # drawing lines between not close landmarks
        cv2.line(frm, FlipXYPos(hand[0]), FlipXYPos(hand[5]), (0,252,124), 2)
        cv2.line(frm, FlipXYPos(hand[0]), FlipXYPos(hand[17]), (0,252,124), 2)
        cv2.line(frm, FlipXYPos(hand[5]), FlipXYPos(hand[9]), (0,252,124), 2)
        cv2.line(frm, FlipXYPos(hand[9]), FlipXYPos(hand[13]), (0,252,124), 2)
        cv2.line(frm, FlipXYPos(hand[13]), FlipXYPos(hand[17]), (0,252,124), 2)

        for i in range(1,21): # drawing the lines between close points
            if i != 5 and i != 9 and i != 13 and i != 17:
                cv2.line(frm, FlipXYPos(hand[i - 1]), FlipXYPos(hand[i]), (0,252,124), 2)

def DrawHandRectangle(frm, hand, name):
    
    minCoor, maxCoor = GetLowHighCoor(hand)
    minCoor = FlipXYPos(minCoor) # GetLoweHighCoor() returns in (yPos,xPos)
    maxCoor = FlipXYPos(maxCoor) # and cv2.rectangle() needs in (xPos, yPos) 
    cv2.rectangle(frm,minCoor,maxCoor,(0,0,255),5)
    cv2.putText(frm,name,(minCoor),cv2.FONT_HERSHEY_SIMPLEX,1,(255,255,255),5,cv2.LINE_4)

# min - max normalization
def NormalizeData(hand):
    (minY, minX),(maxY, maxX) = GetLowHighCoor(hand)
    minValsArr = np.array((minY, minX),np.int16)
    hand = np.subtract(hand, minValsArr,dtype=np.float32)
    
    recYLen = maxY - minY
    recXLen = maxX - minX
    if recYLen == 0 or recXLen == 0:
        return "invalid hand - all x or all y values are the same"
    
    handRecLen = (recYLen, recXLen)

    hand = np.divide(hand,handRecLen)
    return hand

# standardization



def CheckMatchPercent(normGesture, normHand):
    normGesture = np.array(normGesture, dtype = np.float32)
    normHand = np.array(normHand, dtype = np.float32)
    # get difference between each landmrk equivelent
    percentMatch = np.subtract(normGesture, normHand)
    # get the absolute difference 
    percentMatch = np.abs(percentMatch)
    # because the range is  0 - 1 it is already in percent
    # get the sum of the percentage difference
    percentMatch = np.sum(percentMatch)
    #get the average diffrence percentage and subtruct from 1 to get how sure percentage
    percentMatch = 1 - percentMatch/42
    # turn into percentages
    percentMatch = (math.floor(percentMatch*(10**4)))/(10**4)
    return percentMatch

def GetGestureMatch(gestureArr, hand):
    hand = NormalizeData(hand)
    percentMatchArr = np.zeros(len(gestureArr), dtype = np.float16)
    
    for i in range(len(gestureArr)):
        perMatch = CheckMatchPercent(gestureArr[i], hand)
        percentMatchArr[i] = perMatch

    
    matchIndex = np.argmax(percentMatchArr)
    return matchIndex

# the gesture file has to be built like this:
# 
# first line: list of names of gestures by order of apearance in the file 
# and the have to be seperated by a coma
# 
# second line to the rest: each data set is like this:
#   its it is 22 lines,
#   its first line is the gesture name
#   then ech of the rest of the 21 lines is hand land mark like this: yNormalized,xNormalized
#   notice!! the order of the lines is the order of the landmarks meaning:
#       second line in dataset - 0th landmark
#       third line in dataset - 1st landmark
#       and so on...
#   datasets are seperated by going one line down from the previous one


def GetGesturesArr(fileName):
    tempArr = GetDatabaseCSV(fileName)

    gestureCount = len(tempArr[0])
    gesturesArr = np.ones((gestureCount,21,2))
    gesturesData = tempArr[1:]

    for i in range(gestureCount):
        gestStartLine = i*22+1
        gestEndLine = gestStartLine + 20
        gesturesArr[i] = np.array(gesturesData[gestStartLine:gestEndLine + 1])


    gestNamesArr = tempArr[0]
    return [gestNamesArr, gesturesArr]

def AddGesture(fileName, gestName, gestLandmarks):
    
    lines =[]
    with open(file = fileName, mode='r') as file:
        lines = list(csv.reader(file))

    if lines:
        lines[0].append(gestName)
    else:
        lines.append([gestName])

    normalizedHand = NormalizeData(gestLandmarks)
    
    lines.append([gestName])
    for i in range(21):
        lines.append([normalizedHand[i][0], normalizedHand[i][1]])
        

    with open(file = fileName, mode='w',newline = '') as file:        
        writer = csv.writer(file)
        writer.writerows(lines)

def GetDataFile(fileName):
    arr = []
    
    with open(fileName, 'r') as file:
        arr = list(csv.reader(file))

    return arr


def DeleteGest(fileName, gestName):
    NoEmptyDatabase(fileName)
    dataFileArr = GetDatabaseCSV(fileName)
    
    gestIndex = -1
    toWriteArr = dataFileArr

    for i in range(len(dataFileArr[0])):
        
        if gestName == dataFileArr[0][i]:
            gestIndex = i
    
    
    if not (gestIndex == -1):
        toWriteArr[0].pop(gestIndex)
        endLine = 22*(gestIndex + 1)

        for i in range(22):
            toWriteArr.pop(endLine - i)

        with open(file = fileName, mode='w',newline = '') as file:        
            writer = csv.writer(file)
            writer.writerows(toWriteArr)
    
    else:
        return -1
        

    


def GetGestIndexByName(fileName, gestName):
    NoEmptyDatabase(fileName)
    namesList,_ = GetGesturesArr(fileName)
    gestIndex = -1

    for i in range(len(namesList)):
        if namesList[i] == gestName:
            return i
    
    return gestIndex



def PrintDatabase(database):
    for row in database:
        print(row)


    
