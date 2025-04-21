const express = require('express');
const Messages = require('../models/message_model')
const router = express.Router();
router.post("/addmsg", async (req, res) => {
  try {
    const { from, to, message } = req.body;

    // Ensure the required fields are provided
    if (!from || !to || !message) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Create a new message document
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    // Respond with success if the message is saved
    if (data) {
      return res.status(200).json({ success: true, message: "Message added successfully", data });
    }

    // Respond with failure if the message couldn't be saved
    return res.status(500).json({ success: false, message: "Failed to add message" });
  } catch (error) {
    // Catch and send any errors
    return res.status(500).json({ success: false, message: "Error while adding message", error: error.message });
  }
});


router.post(
    "/getmsg",
    async (req, res) => {
      try{
const {from,to}=req.body;
const messages = await Messages.find({
  users: { $all: [from, to] },
  ...(from === to ? { users: [from, from] } : {}) // Ensure sender & receiver are the same in self-chat
}).sort({ updatedAt: 1 });

  const projectMessages = messages.map((msg)=>{
    return {
      fromSelf: msg.sender.toString() === from,
      message: msg.message.text,
    };
  });  
  return res.status(200).json({ success: true, message: "Getting all messages",projectMessages });
}
      catch(error){
        return res.status(500).json({ success: false, message: "Error while getting all messages", error: error.message });
      }
    }
  );

module.exports = router;