require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT || 3000;
const url = process.env.DB_URL;
const key = process.env.KEY;
const cookieParser = require('cookie-parser')
const multer = require('multer')
const uploadMiddleWare = multer({ dest: 'uploads/' })
const fs = require('fs')

app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(cors({credentials: true, origin: `http://localhost:${5173}`}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())


mongoose.connect(url).catch(err => console.log(err));

const User = require('./models/User');
const Blog = require('./models/Blog');





// To register new user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'Username already exists' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    console.error('Error in /register:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// to login the user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });

  if (userDoc) {
    const correct = bcrypt.compareSync(password, userDoc.password);
    if (correct) {
      // Sign a JWT with a secret key and include user information
      const token = jwt.sign({ username: userDoc.username, userId: userDoc._id }, key, { expiresIn: '1h' });
      res.cookie('access-token', 'Bearer '+ token, { maxAge: 3600000 }); // 1 hour in milliseconds
      return res.json({ success: 'Login Complete', username });
    }

    return res.status(400).json({ error: 'Password incorrect' });
  }

  return res.status(400).json({ error: 'User Not Exist' });
});




// to verify token of logged in user
app.get('/profile', async (req, res) => {
  const { cookies } = req;
  try {
  const token = cookies['access-token'].slice(7);  
  const decodedToken = await jwt.verify(token, key)
  console.log(decodedToken)
  return res.json(decodedToken)
  } catch(err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  
})




// to cancel the logged in user
app.post('/logout', (req, res) => {
  res.cookie('access-token', '', {})
  return res.status(200).json({ message: 'Logout successful' });
});





// to create new blog.
app.post('/create', uploadMiddleWare.single('file'), async (req, res) => {
  try {
    // Extract and verify the token from cookies
    const token = req.cookies['access-token'].slice(7);
    const decodedToken = await jwt.verify(token, key);
    const userID = decodedToken.userId;

    // Continue with the file upload and blog creation logic
    try {
      // Destructure information from the uploaded file
      const { originalname, path } = req.file;

      // Extract file extension
      const ext = originalname.split('.').pop();

      // Rename the file with the proper extension
      const newPath = path + '.' + ext;
      fs.renameSync(path, newPath);
      console.log(decodedToken)
      // Destructure information from the request body
      const { title, summary, content } = req.body;

      // Create a new Blog document with the provided data and add the userID as the author
      const newBlog = new Blog({
        title,
        summary,
        content,
        cover: newPath,
        author: userID, // Add the userID as the author
      });

      // Save the new Blog document to the database
      const savedBlog = await newBlog.save();

      // Send a success response with the saved blog details
      console.log('Blog saved successfully:', savedBlog);
      res.status(201).json({ success: true, message: 'Blog created successfully', blog: savedBlog });
    } catch (error) {
      // Handle any unexpected errors during file upload or blog creation
      console.error('Unexpected error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  } catch (err) {
    // Handle token verification error
    console.error('Token verification error:', err);
    res.status(401).json({ error: 'Unauthorized' });
  }
});





app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', ['username'])
      .sort({createdAt: -1}).limit(3);
    res.json({ blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/blogs/:id', async (req, res) => {
  const { id } = req.params
  try {
    const blog = await Blog.findOne({_id: id}).populate('author', ['username'])
    res.status(200).json({blog})
  }
  catch(error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

})

app.listen(PORT, () => {
  console.log(url);
  console.log(`Server Running on http://localhost:${PORT}`);
});


// JAVASCRIPT 
// TYPE SCRIPT
// MACHINE LEARNING.