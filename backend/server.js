// backend/server.js

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB URI and client setup
const uri = 'mongodb+srv://Harsh_kapadiya:24502450harsh@m0.gnwylrc.mongodb.net/?retryWrites=true&w=majority&appName=M0';
const client = new MongoClient(uri);

let usersCollection;

// Connect to MongoDB
async function connectToDB() {
  try {
    await client.connect();
    const db = client.db('nexidea'); // Your DB name
    usersCollection = db.collection('users'); // Your Collection
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB', err);
  }
}
connectToDB();

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('➡ Login attempt:', email, password);

  try {
    const user = await usersCollection.findOne({ email });

    if (!user) {
      console.log('❌ Email not found');
      return res.status(401).json({ success: false, message: 'Invalid credentials: email not found' });
    }

    if (user.password !== password) {
      console.log('❌ Wrong password');
      return res.status(401).json({ success: false, message: 'Invalid credentials: wrong password' });
    }

    console.log('✅ Login successful');
    res.status(200).json({ success: true, message: 'Login successful', user });
  } catch (err) {
    console.error('💥 Error during login:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST: Register route
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      const existingUser = await usersCollection.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }
  
      await usersCollection.insertOne({ name, email, password });
  
      res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (err) {
      console.error('❌ Registration error:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });

app.listen(port, () => {
  console.log('🚀 Server is running at http://localhost:${port}');
});
