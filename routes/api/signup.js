const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../config/models/User');
const { body, validationResult } = require('express-validator');

//  Route   post  api/users
//  Desc    Register user
//  Access  Public

router.post(
  '/',
  // Name and pass the second parameter as a custom error message
  [body('userName', 'Name is required').not().isEmpty(), body('email', 'Please include a valid email').isEmail(), body('password', 'Please include a valid password').isLength({ min: 5 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userName, email, password, phoneNo, bloodGroup, city, cnic, dob } = req.body;
    try {
      let feedbackSubmitted=[];
      // see if user exits
      console.log('Data -> ', req.body);
      let user = await User.findOne({ email });
      if (user) {
        res.json({
          status: false,
          message: "Email Already Exists",
        });
      }
      // instance of a user
      user = new User({
        userName,
        email,
        password,
        phoneNo,
        bloodGroup,
        city,
        cnic,
        dob,
        feedbackSubmitted,
      });

      // encrypt password

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      const savedUser = await user.save();

  
      // return jsonwebtoken

      const payload = {
        user: { id: user.id },
      };

      jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
        if (err){
          res.json({
            status: false,
            message: "No Token Found",
          });
        }else{
          res.json({
            status: true,
            message: 'New user created!',
            user : user
          });
        }
      
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
