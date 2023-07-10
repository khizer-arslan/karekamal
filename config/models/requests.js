const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  hospitalName: {
    type: String,
  },
  phonenumber: {
    type: Number,

  },
  business: {
    type: String,

  },
  cnic: {
    type: Number,

  },
  amount: {
    type: Number,

  },
  instituteName: {
    type: String,
  },
  city: {
    type: String,
  },
  requestType: {
    type: String,
    enum: ['Rashan', 'medicine', 'education', 'blood'],
    required: true,
  },
  Disease: {
    type: String,
  },
  hospitalPhoneNumber: {
    type: String
  },

  familyMember: {
    type: Number,
  },
  bloodGroup: {
    type: String
  },
  approved: {
    type: Boolean,
    default: false
  },
  requestBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  }

});

const Requests = mongoose.model('requests', RequestSchema);
module.exports = Requests;
