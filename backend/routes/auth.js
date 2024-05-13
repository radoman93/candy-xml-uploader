const express = require('express');
const bcrypt = require("bcrypt");
const db = require("../database");
const validator = require('validator');
const session = require("express-session");
const router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.use(session({
  secret: 'haier1337', // replace 'your secret key' with your own secret key
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

router.post('/login', function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  db.get('SELECT * FROM users WHERE username = ?', [username], function(err, row) {
    if (err) {
      return res.status(500).send(err.message);
    }
    if (!row) {
      return res.status(401).send('Invalid username or password');
    }

    bcrypt.compare(password, row.password, function(err, result) {
      if (result) {
        // Passwords match
        req.session.user = { username: username }; // set session data
        res.send({ message: 'Login successful', user: req.session.user, }); // send response with user data
      } else {
        // Passwords don't match
        res.status(401).send('Invalid username or password');
      }
    });
  });
});
router.post('/register', function(req, res) {
  const username = req.body.username;
  const password = req.body.password;


  if (!validator.isEmail(username)) {
    return res.status(400).send('Invalid email format');
  }

  bcrypt.hash(password, 10, function(err, hash) {
    if (err) {
      return res.status(500).send(err.message);
    }

    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function(err) {
      if (err) {
        // Could not register user
        return res.status(500).send(err.message);
      }

      // User registered successfully
      res.send('User registered successfully');
    });
  });
});


module.exports = router;
