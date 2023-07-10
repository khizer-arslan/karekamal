const express = require('express');
const router = express.Router();
const mid = require('../../middleware/mid');
const User = require('../../config/models/User');
const jwt = require('jsonwebtoken');
const { exec } = require('child_process');
var nodemailer = require('nodemailer');
// const MailSlurp = require('mailslurp-client');
// import { MailSlurp } from 'mailslurp-client';
const config = require('config');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

//  Route   post  api/users
//  Desc    Authenticate user
//  Access  Public
let MyCode = null;
router.post(
  '/mailsent',
  // Name and pass the second parameter as a custom error message
  [body('email', 'Please include a valid email').isEmail()],
  async (req, res) => {
    const { email } = req.body;
    let user = await User.findOne({ email });
    console.log('user ', user);
    if (user) {
      const transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'karekamal786@gmail.com', // generated ethereal user
          pass: 'kzivnetkesjyfded', // generated ethereal password
        },
      });
      const val = Math.floor(1000 + Math.random() * 9000);
      MyCode = val;
      transport
        .sendMail({
          from: 'karekamal786@gmail.com',
          to: `${email}`,
          subject: 'Please confirm your account',
          html: `<h1>Email Confirmation</h1>
          <h2>Hello ${user.userName}</h2>
          <p>Thank you for subscribing. Please confirm your email by clicking on the following link
          <b>Your confirmation code is ${val}</b>
          </p>
          </div>`,
        })
        .then((response) => {
          console.log('mail sent!!');

          return res.status(200).json({
            status: true,
            message: 'Mail Sent Successfully !',
          });
        })
        .catch((err) => console.log(err));
    } else {
      return res.status(200).json({
        status: false,
        message: 'User Not found !',
      });
    }

    //here
  }
);

router.post(
  '/varifycode',
  // Name and pass the second parameter as a custom error message
  // [body('code', 'Please include a valid code').isEmail()],
  async (req, res) => {
    const { code } = req.body;
    console.log('Mycode', MyCode);
    console.log('code ', code);
    if (MyCode == code) {
      console.log('login here');
      return res.status(200).json({
        status: true,
        message: 'Code Verified !',
      });
    } else {
      console.log('fail to login');

      return res.status(200).json({
        status: false,
        message: 'Invalid Code !',
      });
    }

    //here
  }
);

router.post(
  '/changepsw',
  [body('email', 'Please include a valid email').isEmail()],
  async (req, res) => {
    // console.log('hi-> ', req._user);
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        status: false,
        message: 'User not found !',
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save().then((response) => {
      console.log('response ->', response);
    });

    return res.status(200).json({
      status: true,
      message: 'Password changed successfully !',
    });
    //here
  }
);

//  Route   post  api/profile/github/:username
//  Desc    get user repos from Github
//  Access  Public

module.exports = router;
