const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
var nodemailer = require('nodemailer');
const User = require('../../config/models/User');
const { body, validationResult } = require('express-validator');

//  Route   post  api/users
//  Desc    Register user
//  Access  Public
let MyCode = null;

// router.post(
//   '/',
//   // Name and pass the second parameter as a custom error message
//   [
//     body('userName', 'Name is required').not().isEmpty(),
//     body('email', 'Please include a valid email').isEmail(),
//     body('password', 'Please include a valid password').isLength({ min: 5 }),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { userName, email, password, phoneNo, bloodGroup, city, cnic, dob } =
//       req.body;
//     try {
//       let feedbackSubmitted = [];
//       // see if user exits
//       console.log('Data -> ', req.body);
//       let user = await User.findOne({ email });
//       if (user) {
//         res.json({
//           status: false,
//           message: 'Email Already Exists',
//         });
//       }
//       // instance of a user
//       user = new User({
//         userName,
//         email,
//         password,
//         phoneNo,
//         bloodGroup,
//         city,
//         cnic,
//         dob,
//         feedbackSubmitted,
//       });

//       // encrypt password

//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(password, salt);

//       const savedUser = await user.save();

//       // return jsonwebtoken

//       const payload = {
//         user: { id: user.id },
//       };

//       jwt.sign(
//         payload,
//         config.get('jwtSecret'),
//         { expiresIn: 360000 },
//         (err, token) => {
//           if (err) {
//             res.json({
//               status: false,
//               message: 'No Token Found',
//             });
//           } else {
//             res.json({
//               status: true,
//               message: 'New user created!',
//               user: user,
//             });
//           }
//         }
//       );
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   }
// );

router.post(
  '/mailsent',
  // Name and pass the second parameter as a custom error message
  [body('email', 'Please include a valid email').isEmail()],
  async (req, res) => {
    const { email } = req.body;
    let user = await User.findOne({ email });
    console.log('user ', user);
    if (user) {
      res.json({
        status: false,
        message: 'Email Already Exists',
      });
    } else {
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
          <h2>Hello ${email}</h2>
          <p>Welcome to Kare Kamal. Please confirm your email by clicking on the following link
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
      try {
        let feedbackSubmitted = [];
        // see if user exits
        const {
          userName,
          email,
          password,
          phoneNo,
          bloodGroup,
          city,
          cnic,
          dob,
        } = req.body;
        console.log('Data -> ', req.body);

        // instance of a user
        let user = new User({
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

        if (savedUser) console.log('User Saved!!', savedUser);
        // return jsonwebtoken

        const payload = {
          user: { id: user.id },
        };

        jwt.sign(
          payload,
          config.get('jwtSecret'),
          { expiresIn: 360000 },
          (err, token) => {
            if (err) {
              res.json({
                status: false,
                message: 'No Token Found',
              });
            } else {
              // console.log('login here');
              // return res.status(200).json({
              //   status: true,
              //   message: 'Code Verified !',
              // });

              res.json({
                status: true,
                message: 'New user created!',
                user: user,
              });
            }
          }
        );
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
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

module.exports = router;
