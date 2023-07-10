const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DonationSchema = new mongoose.Schema({
  amount: {
    type: Number,
  },
  requestType: {
    type: String,
    enum: ['rashan', 'medicine', 'education', 'rozgar'],
    required: true,
  },
  requestBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
});

const Donations = mongoose.model('donations', DonationSchema);
module.exports = Donations;
