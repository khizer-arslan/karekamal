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

router.post('/', async (req, res) => {
  console.log("req", req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ 
      status: false,
      msg: 'Validation Error' 
    });
  }
  try {
    const { id, userName, amount, familyM, phone, cnic, business, hospital, disease, city, hospitalPhone, dOB, insName, bloodGroup, type } = req.body;
    console.log("type", type);

    let updates;
    if (type === 'rashanR') {
      updates = {
        type: type,
        userName: userName,//
        amount: amount,//
        familyM: familyM,//
        phone: phone,//
        cnic: cnic,//
        business: business,//
      };
    } else if (type === 'medicineR') {
      updates = {
        type: type,
        userName: userName,//
        amount: amount,//
        phone: phone,//
        hospital: hospital,//
        disease: disease,//
        city: city,//
        hospitalPhone: hospitalPhone,//
      };
    } else if (type === 'educationR') {
      updates = {
        type: type,
        userName: userName,//
        amount: amount,//
        phone: phone,//
        cnic: cnic,//
        business: business,//
        city: city,//
        dOB: dOB,//
        insName: insName,//
      };
    } else if (type === 'bloodR') {
      updates = {
        type: type,
        userName: userName,
        phone: phone,
        cnic: cnic,
        hospital: hospital,
        disease: disease,
        city: city,
        bloodGroup: bloodGroup,
      };
    } else {
      updates = {};
    }


    const NewRecord = {
      $push: { MyRequest: updates },
    };

    const user = await User.findOneAndUpdate(
      { _id: id },
      NewRecord,
      { new: true, runValidators: true }
    )
    // Save to the database
    console.log("USER", user);

    if (!user) {
      return res.status(200).json({ 
        status: false,
        msg: 'User not found' 
      });
    }else{
      return res.status(200).json({
        status: true,
        request: user,
      });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(200).json({ 
      status: false,
      msg: 'Server Error' 
    });
  }
});

module.exports = router;
