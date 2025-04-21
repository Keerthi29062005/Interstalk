const mongoose = require('mongoose');

// The "Schema" should be destructured or accessed directly from mongoose
const { Schema } = mongoose;

// Define the schema correctly
const UserSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Roll_no: {
    type: String,
    required: true,
    unique: true
  },
  Email: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true
  },
  
});

// Export the model correctly
module.exports = mongoose.model('User', UserSchema);