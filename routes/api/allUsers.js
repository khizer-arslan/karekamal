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

router.get(
  '/',
  // Name and pass the second parameter as a custom error message
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.find({ isAdmin: false });
      console.log("USER-> ", user);
      res.json({ user });

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);


router.delete(
  '/:userId',
  // Name and pass the second parameter as a custom error message
  async (req, res) => {
    const { userId } = req.params
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findByIdAndDelete({ _id: userId })
      console.log("USER-> ", user);
      res.status(200).json({
        status: true,
        msg: "Deleted successful"
      })

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);


module.exports = router;
