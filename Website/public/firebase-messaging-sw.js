importScripts(
  'https://www.gstatic.com/firebasejs/11.7.3/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/11.7.3/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyAMjDAxDJVQ0YxlGtdrrYqkHyFzhFoIqa4',
  authDomain: 'reusemart-a150d.firebaseapp.com',
  projectId: 'reusemart-a150d',
  storageBucket: 'reusemart-a150d.firebasestorage.app',
  messagingSenderId: '791796059792',
  appId: '1:791796059792:web:044f479cf2a763e6e7d215',
  measurementId: 'G-NXQTJP8YBZ',
});

const messaging = firebase.messaging();
