const express = require('express');
const router = express.Router();
const User = require('../../config/models/User');
const { body, validationResult } = require('express-validator');

//  Route   post  api/users
//  Desc    Register user
//  Access  Public

router.post(
  '/',
  // Name and pass the second parameter as a custom error message
  //[body('userName', 'Name is required').not().isEmpty(), body('email', 'Please include a valid email').isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        status: false,
        message: "Validation error",
      });
    }

    const { status, message, id } = req.body;

    try {

      let obj = {
        status: status,
        message: message,
      };


      const updates = {
        $push: { feedbackSubmitted: obj },
      };

      const user = await User.findOneAndUpdate(
        { _id: id },
        updates,
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(200).json({
          status: false,
          message: "User not found",
        });
      }else{
        return res.status(200).json({
          status: true,
          message: "Feedback submitted !",
          user: user
        });
      }
    } catch (err) {
      console.error(err.message);
      return res.status(200).json({
        status: false,
        message: "Server rserror",
      });
    }



  }
);

module.exports = router;
