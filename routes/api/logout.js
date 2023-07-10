const express = require('express');
const router = express.Router();
const mid = require('../../middleware/mid');
const User = require('../../config/models/User');
const jwt = require('jsonwebtoken');

const config = require('config');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

//  Route   post  api/users
//  Desc    Authenticate user
//  Access  Public

router.post('/', mid, async (req, res) => {
  console.log('USER is here ', req);
  const { id } = req.user;
  try {


  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;
