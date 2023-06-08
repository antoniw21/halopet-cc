require('dotenv').config();

// https://firebase.google.com/docs/admin/setup
// https://firebase.google.com/docs/firestore/quickstart#initialize
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

// https://firebase.google.com/docs/storage/admin/start?hl=id#use_a_default_bucket
const { getStorage } = require('firebase-admin/storage');

//Admin SDK configuration snippet
var admin = require("firebase-admin");

var serviceAccount = require("../firebase-sdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.BUCKET
});

const db = getFirestore();
const bucket = getStorage().bucket();

module.exports = {admin, db, bucket};