const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: Number,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  cnic: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    default: Date.now,
  },
  feedbackSubmitted: {
    type: Array,
  },
  MyRequest: {
    type: Array,
  },
  ReadyForBlood: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model('user', UserSchema);
module.exports = User;



// Admin Credentials
// "email": "moazam@gmail.com",
//   "password": "strong!Passsword123",