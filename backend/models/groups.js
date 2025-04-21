const mongoose = require('mongoose');

// The "Schema" should be destructured or accessed directly from mongoose
const { Schema } = mongoose;

// Define the schema correctly
const GroupSchema = new Schema({
    GID: {
        type:Number,
        require:true,
        unique:true
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
      }
});

// Export the model correctly
module.exports = mongoose.model('Group', GroupSchema);