require('dotenv').config();

// https://firebase.google.com/docs/admin/setup
// https://firebase.google.com/docs/firestore/quickstart#initialize
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const init = require('./server');

//Admin SDK configuration snippet
var admin = require("firebase-admin");

var serviceAccount = require("../firebase-sdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.PROJECT_ID,
});

init();