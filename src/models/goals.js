const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
     // required: true,
    },
    description: {
      type: String,
      //required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      //ref: 'User',
      //required: true,
    },
  },

);

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
