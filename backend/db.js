const mongoose = require("mongoose");

const mongoURL = "mongodb+srv://Heramb_Rallapally:heramb3112@cluster0.luz4m.mongodb.net/Similarity_HAM?retryWrites=true&w=majority&appName=Cluster0";

const mongoDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongoose connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = mongoDB;
