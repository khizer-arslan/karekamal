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
  [body('userName', 'Name is required').not().isEmpty(), body('email', 'Please include a valid email').isEmail()],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, userName, email, phoneNo, bloodGroup, city, cnic, dob } = req.body;

    try {
      // Make sure the request body contains the fields you want to update
      const updates = {
        userName: userName,
        email: email,
        phoneNo: phoneNo,
        bloodGroup: bloodGroup,
        city: city,
        cnic: cnic,
        dob: dob,
      };

      // Remove undefined fields
      Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

      const user = await User.findOneAndUpdate(
        { _id: id }, // get user id from request object, you might want to change it based on your setup
        { $set: updates },
       // { new: true, runValidators: true } // options: return the modified document rather than the original and run schema validators
      );

      if (!user) {
        return res.status(200)
        .json({ 
          status : false,
          msg: 'User not found' 
        });
      }else{
        return res.status(200)
        .json({ 
          status : true,
          msg: 'Profile Updated Sucessfully !',
          user: user 
        });
      }

    
    } catch (err) {
      return res.status(200)
      .json({ 
        status : false,
        msg: 'Server Error' 
      });
    }
  }
);

module.exports = router;
