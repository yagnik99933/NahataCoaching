// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.0.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.0.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyC4IoQvmz79wobSSDIMOGaCwFd37214TEU",
  authDomain: "nahatacoaching.firebaseapp.com",
  databaseURL: "https://nahatacoaching.firebaseio.com",
  projectId: "nahatacoaching",
  storageBucket: "nahatacoaching.appspot.com",
  messagingSenderId: "41344872101",
  appId: "1:41344872101:web:64916015591ec34037674c",
  measurementId: "G-3QPF07QPGE"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.getToken({vapidKey: "BCzAbU5BdOeeRF2BHS9fNNEsiXhnvuN-s8AIT6yc-jjQE4wCJrtDwA6RtMubXKKrvyi_Z296S33zbNey7S-z8wU"});

