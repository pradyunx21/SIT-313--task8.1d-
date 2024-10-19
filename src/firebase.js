// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDzWG3TkIbusi8nkIycJaefS3-bTOR_2bM",
  authDomain: "task81d-403f4.firebaseapp.com",
  databaseURL: "https://task81d-403f4-default-rtdb.firebaseio.com",
  projectId: "task81d-403f4",
  storageBucket: "task81d-403f4.appspot.com",
  messagingSenderId: "642605558822",
  appId: "1:642605558822:web:e3f4e459f45bcbeb0c4ae7",
  measurementId: "G-7JX8150Q7P"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
const firestore = getFirestore(app);
const storage = getStorage(app);

export { firestore, storage };
