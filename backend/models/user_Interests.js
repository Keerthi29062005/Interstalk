const mongoose = require('mongoose');

// The "Schema" should be destructured or accessed directly from mongoose
const { Schema } = mongoose;

// Define the schema correctly
const UserSchema = new Schema({
  Roll_no: {
    type: String,
    required: true
  },
  Sports: {
    type:String,
    required: true
  },
  Binge_watch: {
    type:String,
    required: true
  },
  Technology: {
    type:String,
    required: true
  },
  Music: {
    type:String,
    required: true
  },
  Movies: {
    type:String,
    required: true
  },
  group_assigned :{
    type:Number
  }
});

// Export the model correctly
module.exports = mongoose.model('user_Interests', UserSchema);