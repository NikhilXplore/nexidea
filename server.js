// Description: A simple Node.js server using Express and MongoDB Atlas for user authentication.
// Dependencies: express, mongoose, body-parser

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// ✅ Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ MongoDB Atlas Connection
mongoose.connect('mongodb+srv://harshug24cs:eKAFL877Qh8qjB@cluster0.mdalqzy.mongodb.net/cluster0?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('❌ MongoDB Connection Error:', err);
});

// ✅ SCHEMA & MODEL
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model('User', userSchema);

// ✅ LOGIN Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid username or password');
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// ✅ SIGNUP Route (Optional)
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    const newUser = new User({ username, password });
    await newUser.save();
    res.status(200).send('User registered');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log('🚀 Server running at http://localhost:${3000}');
});
