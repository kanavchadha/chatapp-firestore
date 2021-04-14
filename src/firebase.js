import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyD2PKvkCEaUzswb9IQMhDo_YY0fDCkmsKA",
    authDomain: "spotify-b3ae1.firebaseapp.com",
    databaseURL: "https://spotify-b3ae1.firebaseio.com",
    projectId: "spotify-b3ae1",
    storageBucket: "spotify-b3ae1.appspot.com",
    messagingSenderId: "957900964752",
    appId: "1:957900964752:web:18130f898f2eec2052e915",
    measurementId: "G-8FEH5071CC"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;