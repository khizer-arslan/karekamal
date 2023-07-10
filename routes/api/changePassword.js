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
  // [body('password', 'Please include a valid password').isLength({ min: 5 })],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        status: false,
        message: "Validation Errors",
      });
    }

    try {
      const { password, newPassword } = req.body;
  
      
      if (!password || !newPassword) {
        return res.status(200).json({
          status: false,
          message: "Please enter both old and new passwords.",
        });
      }
  
      // Find the user by id
      const user = await User.findById(req.body.id).select('+password');  // You might need to change this line to match your authentication setup
      if (!user) {
        return res.status(200).json({
          status: false,
          message: "User not found",
        });
      }
      // Check old password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(200).json({
          status: false,
          message: "Incorrect old password.",
        });
      }
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Update the password in the database
      user.password = hashedPassword;
      await user.save();
      
      return res.status(200).json({
        status: true,
        message: "Password updated successfully.",
      });
    } catch (err) {
      console.error(err.message);
      return res.status(200).json({
        status: false,
        message: "Server error",
      });
    }
  }
);

module.exports = router;
