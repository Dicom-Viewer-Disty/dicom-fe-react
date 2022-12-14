// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyB9pU5oAIvbkE3BLam-LvH0ZELkPqK38RI",
  authDomain: "bantubantuin-dev.firebaseapp.com",
  projectId: "bantubantuin-dev",
  storageBucket: "bantubantuin-dev.appspot.com",
  messagingSenderId: "320642068209",
  appId: "1:320642068209:web:eee6a4c27b78f0c34c0350",
  measurementId: "G-N3XD6YEMMF",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  // console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
