const firebaseConfig = {
    apiKey: "AIzaSyCvWFB27eewjZtKwlEk4F0qvMm6nn2uoGY",
    authDomain: "hand-recognition-a7ca9.firebaseapp.com",
    projectId: "hand-recognition-a7ca9",
    storageBucket: "hand-recognition-a7ca9.firebasestorage.app",
    messagingSenderId: "864510647675",
    appId: "1:864510647675:web:60cd762ff6ecafd10631de"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ..
  });


  // <script src="https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"></script>
  // <script src="https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js"></script>