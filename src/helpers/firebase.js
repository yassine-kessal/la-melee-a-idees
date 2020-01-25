import * as firebase from "firebase/app";

import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

var firebaseConfig = {
  apiKey: "AIzaSyCYBV_DyoMB0NGOn_5kLl4OirTB0wFPfHY",
  authDomain: "la-melee-a-idees-db6ed.firebaseapp.com",
  databaseURL: "https://la-melee-a-idees-db6ed.firebaseio.com",
  projectId: "la-melee-a-idees-db6ed",
  storageBucket: "la-melee-a-idees-db6ed.appspot.com",
  messagingSenderId: "490013515023",
  appId: "1:490013515023:web:75abb615eeaa58536f727a",
  measurementId: "G-XEYCCLC31T"
};

const firebaseInstance = firebase.initializeApp(firebaseConfig);

const firestore = firebaseInstance.firestore();
const authentication = firebaseInstance.auth();
const storage = firebaseInstance.storage();
const rebase = require('re-base').createClass(firestore);

export {firebase, firebaseInstance, firestore, authentication, storage, rebase};
