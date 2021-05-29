// ********** Importing Modules **********
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const middleware = require('./middleware');


// ********** Using Modules **********
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));


// ********** Database Connection **********
mongoose.connect('mongodb://localhost:27017/twitterDatabase', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(function () {
    console.log('Database Connection Successful');
}).catch(function (err) {
    console.log(`Error setting up connection to database: ${err}`);
});


// ********** Routes **********
// Home Route
app.get('/', middleware.isLoggedIn, function(req, res) {
    res.render('home', {userLoggedIn: req.session.user});
});

// Login Route
const loginRoutes = require('./routes/loginRoutes');
app.use('/login', loginRoutes);

// Register Route
const registerRoutes = require('./routes/registerRoutes');
app.use('/register', registerRoutes);

// Post Route
const postRoutes = require('./routes/postRoutes');
app.use('/post', postRoutes);

// Profile Route
const profileRoutes = require('./routes/profileRoutes');
app.use('/profile', profileRoutes);

// Logout Route
const logoutRoutes = require('./routes/logoutRoutes');
app.use('/logout', logoutRoutes);

// ********** API Routes **********
// Posts Route
const postsApiRoute = require('./routes/api/posts');
app.use('/api/posts', postsApiRoute);

// Users Route
const usersApiRoute = require('./routes/api/users');
app.use('/api/users', usersApiRoute);

// ********** Server listening on port: 3000 **********
app.listen(3000, function () {
    console.log('Server is running on port 3000')
});