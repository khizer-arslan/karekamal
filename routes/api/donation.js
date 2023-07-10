const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../config/models/User');
const { body, validationResult } = require('express-validator');

router.post('/', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({
      status: false,
      msg: 'Validation Error',
    });
  }
  try {
    const { id, amount, type } = req.body;
    console.log('type', type);

    let updates;
    if (type === 'rashanR') {
      updates = {
        type: type,

        amount: amount, //
        //
      };
    } else if (type === 'medicineR') {
      updates = {
        type: type,

        amount: amount, //
      };
    } else if (type === 'educationR') {
      updates = {
        type: type,

        amount: amount, //
      };
    } else if (type === 'rozgarR') {
      updates = {
        type: type,
        amount: amount, //
      };
    } else {
      updates = {};
    }

    const NewRecord = {
      $push: { MyDonation: updates },
    };

    const user = await User.findOneAndUpdate({ _id: id }, NewRecord, {
      new: true,
      runValidators: true,
    });
    // Save to the database
    console.log('USER');

    if (!user) {
      return res.status(200).json({
        status: false,
        msg: 'User not found',
      });
    } else {
      return res.status(200).json({
        status: true,
        request: user,
      });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(200).json({
      status: false,
      msg: 'Server Error',
    });
  }
});

module.exports = router;
