const mongoose = require('mongoose');
const { Schema } = mongoose;

const GroupMessageSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  groupId: {
    type:String,
    required: true,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('GroupMessage', GroupMessageSchema);
