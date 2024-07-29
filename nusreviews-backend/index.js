const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const checkUser = async (email) => {
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    return { exists: true, userRecord };
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return { exists: false };
    }
    throw error;
  }
};

app.post('/check-user', async (req, res) => {
  const { email } = req.body;
  try {
    const result = await checkUser(email);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});