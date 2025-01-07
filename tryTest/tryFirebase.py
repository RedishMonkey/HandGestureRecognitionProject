import firebase_admin
from firebase_admin import credentials, db
from datetime import datetime

# setups before running code
cred = credentials.Certificate("firebaseCertificate.json")
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://hand-recognition-a7ca9-default-rtdb.europe-west1.firebasedatabase.app/"
})

# update information to database
ref = db.reference("gesture")  # Adjust the reference path to your database structure
beforeTime = datetime.now()
ref.set({
    "last_gesture": "stuff"
})
afterTime = datetime.now()

setTime = afterTime-beforeTime
setTime = setTime.microseconds//1000


beforeTime = afterTime
result = ref.get()
afterTime = datetime.now()

getTime = afterTime- beforeTime
getTime =getTime.microseconds//1000

print(f"result: {result}")
print(f"setTime: {setTime}, getTime: {getTime}")