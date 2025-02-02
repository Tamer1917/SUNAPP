// تكوين Firebase (استبدل القيم بقيم مشروعك في Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyBrfHwGulQyWW36LodXqNbcPtvV2J1wk8U",
    authDomain: "sunapp-85501.firebaseapp.com",
    projectId: "sunapp-85501",
    storageBucket: "sunapp-85501.firebasestorage.app",
    messagingSenderId: "146439638941",
    appId: "1:146439638941:web:abef499250246650c6e974"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function createUser(userId, username) {
    let userRef = database.ref("users/" + userId);
    userRef.once("value").then((snapshot) => {
        if (!snapshot.exists()) {
            userRef.set({
                username: username,
                points: 0,
                wins: 0,
                losses: 0
            });
        }
    });
}

