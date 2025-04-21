const express =  require('express');
const GroupMessage = require('../models/groupchat'); // Ensure this path is correct
const router = express.Router();
router.get("/ping", (req, res) => {
  console.log("🔥 grpmsg router pinged");
  res.json({ ok: true });
});
// Endpoint to add a new group message
router.post("/addgroupmsg", async (req, res) => {
  try {
    const { sender, message } = req.body;
    
    // Ensure required fields are provided
    if (!sender || !message) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    
    // Create a new group message document
    const data = await GroupMessage.create({
      message,
      sender,
    });
    
    // Respond with success if the message is saved
    if (data) {
      return res.status(200).json({ success: true, message: "Group message added successfully", data });
    }
    
    // Respond with failure if the message couldn't be saved
    return res.status(500).json({ success: false, message: "Failed to add group message" });
  } catch (error) {
    // Catch and send any errors
    return res.status(500).json({ success: false, message: "Error while adding group message", error: error.message });
  }
});

// Endpoint to get all group messages
router.post("/getgroupmsg", async (req, res) => {
  try {
    // Optionally, you can pass the current user's id in req.body.sender to determine which messages are sent by self
    const { sender } = req.body;
    
    // Retrieve all group messages sorted by creation/update time
    const messages = await GroupMessage.find().sort({ updatedAt: 1 });
    
    const projectMessages = messages.map((msg) => {
      return {
        // If you need to know whether a message is sent by the current user, compare sender IDs.
        // Otherwise, you can simply send the message text and sender info.
        fromSelf: sender ? msg.sender.toString() === sender : false,
        message: msg.message,
      };
    });
    
    return res.status(200).json({ success: true, message: "Getting all group messages", projectMessages });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error while getting group messages", error: error.message });
  }
});

module.exports = router;
