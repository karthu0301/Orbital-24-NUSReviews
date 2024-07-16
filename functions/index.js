const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin SDK
admin.initializeApp();

const app = express();
app.use(cors({origin: true})); // Enable CORS
app.use(express.json());

const checkUser = async (email) => {
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    return {exists: true, userRecord};
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      return {exists: false};
    }
    throw error;
  }
};

app.post("/check-user", async (req, res) => {
  const {email} = req.body;
  try {
    const result = await checkUser(email);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({error: error.message});
  }
});

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);
