const express =  require('express');
const GroupMessage = require('../models/groupchat' ); // Ensure this path is correct
const router = express.Router();
const UserInterests = require('../models/user_Interests');
const User= require('../models/users');
router.get("/ping", (req, res) => {
  console.log("🔥 grpmsg router pinged");
  res.json({ ok: true });
});

// Get all communities a user is part of
router.post('/getcommunities', async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ success: false, message: "User ID is required" });

  try {
    const user = await UserInterests.findOne({ Roll_no: userId });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const communities = [];

    if (user.Sports) communities.push({ name: user.Sports, category: 'Sports' });
    if (user.Binge_watch) communities.push({ name: user.Binge_watch, category: 'Binge_watch' });
    if (user.Technology) communities.push({ name: user.Technology, category: 'Technology' });
    if (user.Music) communities.push({ name: user.Music, category: 'Music' });
    if (user.Movies) communities.push({ name: user.Movies, category: 'Movies' });

    return res.status(200).json({ success: true, communities });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error fetching communities", error: err.message });
  }
});

router.post('/getmembers', async (req, res) => {
  const { category, value } = req.body;

  if (!category || !value) {
    return res.status(400).json({ success: false, message: "Category and value are required" });
  }

  try {
    // Get roll numbers based on interest
    const interestDocs = await UserInterests.find(
      { [category]: value },
      { Roll_no: 1, _id: 0 }
    );
    const rollNumbers = interestDocs.map(doc => doc.Roll_no);

    if (rollNumbers.length === 0) {
      return res.status(200).json({ success: true, members: [] });
    }

    // Fetch users with names and roll numbers in one go
    const users = await User.find(
      { Roll_no: { $in: rollNumbers } },
    );
    // Create a map for quick lookup
    const userMap = new Map(users.map(user => [user.Roll_no, user.Name]));

    // Map rollNumbers to member objects with Name
    const members = rollNumbers.map(rn => ({
      Roll_no: rn,
      Name: userMap.get(rn) || 'Unknown'
    }));


    return res.status(200).json({ success: true, members });
  } catch (err) {
    console.error("Error in getmembers:", err);
    return res.status(500).json({
      success: false,
      message: "Error fetching members",
      error: err.message
    });
  }
});


// Endpoint to add a new group message
router.post("/addgroupmsg", async (req, res) => {
  try {
    const { sender, message, groupId  } = req.body;
    
    // Ensure required fields are provided
    if (!sender || !message || !groupId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    
    // Create a new group message document
    const data = await GroupMessage.create({
      message,
      sender, groupId
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
// controllers/group.js (or wherever your route lives)
router.post("/getgroupmsg", async (req, res) => {
  const { sender, groupId } = req.body;
  if (!groupId) {
    return res.status(400).json({ success: false, message: "groupId is required" });
  }

  // 1) fetch and populate the User’s Name
  const messages = await GroupMessage
    .find({ groupId })
    .sort({ createdAt: 1 })
    .populate("sender", "Name");   // <-- bring in sender.Name

  // 2) build a clean JSON payload
  const projectMessages = messages.map(msg => ({
    fromSelf: sender === msg.sender._id.toString(),
    message: msg.message,
    senderName: msg.sender.Name    // <-- this is where senderName comes from
  }));

  return res.json({ success: true, projectMessages });
});


module.exports = router;
