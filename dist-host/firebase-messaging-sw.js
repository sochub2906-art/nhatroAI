importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
// Note: These values should match your firebase.ts
firebase.initializeApp({
    apiKey: "AIzaSyCkJSeFyvQf2q1PwXSxY0livfT8of6T2rA",
    authDomain: "nhatroai.firebaseapp.com",
    projectId: "nhatroai",
    storageBucket: "nhatroai.firebasestorage.app",
    messagingSenderId: "381982586693",
    appId: "1:381982586693:web:f3d9af6b9d2a38b9c5b02c"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-512.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
