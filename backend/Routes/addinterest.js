const express = require('express');
const router = express.Router();
const Interests = require('../models/user_Interests'); // Adjust path as necessary

// @route   POST /api/interests/addinterest
// @desc    Add user interests
// @access  Public
router.post('/addinterests', async (req, res) => {
    console.log('🚀 POST /addinterests hit!');
  try {
    const { Roll_no, Sports, Movies, Music, Technology, Binge_watch, group_assigned } = req.body;

    // Check if user already submitted interests
    const existing = await Interests.findOne({ Roll_no });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User interests already submitted.' });
    }

    const newInterest = new Interests({
      Roll_no,
      Sports,
      Movies,
      Music,
      Technology,
      Binge_watch,
      group_assigned
    });

    await newInterest.save();
    res.status(201).json({ success: true, message: 'Interests saved successfully.' });
  } catch (error) {
    console.error('Error saving interests:', error.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
