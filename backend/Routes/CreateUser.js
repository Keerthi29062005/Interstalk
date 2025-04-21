const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const router = express.Router();
const User = require('../models/users'); // Ensure model is correctly imported
const User_Interests = require('../models/user_Interests'); // Ensure model is correctly imported
const Groups = require('../models/groups');

const { body, validationResult } = require('express-validator');
require('dotenv').config();
// Route to create a new user

router.post(
  "/createuser",
  [body('Email', 'Incorrect email').isEmail()],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ errors: result.array() });
    }

    const salt = await bcrypt.genSalt(10);
    let securePassword = await bcrypt.hash(req.body.Password, salt);

    try {
      console.log('User creation route hit');
const Name=req.body.Name;
      const Roll_no = req.body.Roll_no;
      const Email = req.body.Email;
      const Password = securePassword;
      const existingUser = await User.findOne({ Roll_no });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Roll number already in use' });
      }

      console.log('Creating user with data:', { Name,Roll_no, Email, Password });

      // Create the user in the database
      const newUser = await User.create({Name, Roll_no, Email, Password });

      console.log('User created:', newUser);

      res.status(201).json({ success: true, message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ success: false, message: 'Failed to create user', error: error.message });
    }
  }
);

// Route for user login
router.post(
  "/loginuser",
  [body('Email', 'Incorrect email').isEmail()],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    try {
      const { Roll_no, Email, Password } = req.body;
 
      // Find the user by roll number
      const newUserdata = await User.findOne({ Roll_no });
      console.log(newUserdata);
      if (!newUserdata) {
        return res.status(400).json({ success: false, message: 'Incorrect credentials' });
      }

      // Compare the entered password with the hashed password in the database
      const isPasswordMatch = await bcrypt.compare(Password, newUserdata.Password);
      if (isPasswordMatch) {
        console.log("Successful login");
        return res.status(200).json({
          success: true,
          message: 'Logged in successfully',
          Roll_no: newUserdata.Roll_no,
          Name: newUserdata.Name,
          id: newUserdata._id,
        });
      } else {
        return res.status(400).json({ success: false, message: 'Incorrect Password' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ success: false, message: 'Failed to login', error: error.message });
    }
  }
);


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Extract user id (Roll_no) from the URL
    const user = await User.findOne({ Roll_no: id }); // Find user by Roll_no

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Return user data (excluding sensitive data like password)
    res.status(200).json({
      success: true,
      Roll_no: user.Roll_no,
      Email: user.Email,
      // Add other user details you need to return
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user data' });
  }
});

router.post("/:id/interests", [],async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() }); // Send a 400 response if validation fails
  }
  try {
    console.log('User interest route hit');
    const roll_no=req.params;
    
    console.log(roll_no.id);
    const Roll_no = roll_no.id;
    const Sports = req.body.sports;
    const Movies = req.body.movies;
    const Music = req.body.music;
    const Technology = req.body.technology;
    const Binge_watch = req.body.bingeWatch;
    //need to findout the correct group to assign to
    const temp_var = req.body;

    const group_assigned = await find_group(temp_var);
    console.log(group_assigned);

    console.log('Adding user with interests:', { Roll_no, Sports, Binge_watch, Technology, Music, Movies });
    // Create the user in the database
    const newUser = await User_Interests.create({ Roll_no, Sports, Binge_watch, Technology, Music, Movies, group_assigned });

    console.log('The users Interests are:', newUser);

    // Respond with a success message
    res.status(201).json({ success: true, message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Failed to create user', error: error.message });
  }
});


//Login part
router.post("/loginuser", [body('Email', 'Incorrect email').isEmail()], async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  try {
    const { Email, Password } = req.body;

    // Find the user by email
    const newUserdata = await User.findOne({ Email });
    if (!newUserdata) {
      return res.status(400).json({ success: false, message: 'Incorrect credentials' });
      console.log(newUserdata.Email, Email);
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(Password, newUserdata.Password);
    if (!isPasswordMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect password' });
    }
    return res.status(200).json({ success: true, message: 'Logged in successfully' });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ success: false, message: 'Failed to login', error: error.message });
  }
});
//OTP
const EMAIL_SERVICE_USER = process.env.EMAIL_SERVICE_USER;
const EMAIL_SERVICE_PASS = process.env.EMAIL_SERVICE_PASS; // Add App Password here for Gmail

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_SERVICE_USER,
    pass: EMAIL_SERVICE_PASS,
  },
  debug: true, // Show logs
  logger: true,
});

// Function to generate OTP
function generateOTP() {
  return crypto.randomBytes(3).toString('hex'); // Generates a 6-character OTP
}

// Function to send an email
const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: EMAIL_SERVICE_USER,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };
  } catch (error) {
    return { success: false, error };
  }
};
let otpStore = {};
// Route to send OTP email
router.post(
  "/send-email",
  // Email validation middleware
  body('email').isEmail().withMessage('Incorrect email format'),
  async (req, res) => {
    // Validate the email using express-validator
    const result = validationResult(req);
    if (!result.isEmpty()) {
      // Return all validation errors if email format is invalid
      return res.status(400).json({ errors: result.array() });
    }

    const { email } = req.body; // Extracting email from the request body
    console.log("Request received to send OTP to:", email);

    if (!email) {
      return res.status(400).json({ errors: [{ msg: 'Email is required' }] });
    }

    try {
      // Check if the email exists in the database
      const user = await User.findOne({ Email: email });

      if (!user) {
        // Return error if the email is not in the database
        return res.status(400).json({ success: false, message: 'User not found' });
      }

      // Generate OTP
      const otp = generateOTP();
      otpStore[email] = otp;
      console.log("Generated OTP:", otp);

      // Fixed subject and message
      const subject = "Email Verification";
      const message = "Use the below OTP to login to your account";

      // Add OTP to the message
      const htmlContent = `<p>${message}</p><p>Your OTP is: <strong>${otp}</strong></p>`;

      // Send the email
      const response = await sendEmail({ to: email, subject, html: htmlContent });

      if (response.success) {
        console.log("OTP sent successfully to:", email);
        return res.status(200).json({ success: true, message: 'Email sent successfully!' });
      } else {
        console.error("Error sending OTP:", response.error);
        return res.status(500).json({
          success: false,
          message: 'Failed to send email',
          error: response.error.message,
        });
      }
    } catch (error) {
      console.error("Error in /send-email route:", error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while sending email',
        error: error.message,
      });
    }
  }
);
 
router.post("/verify-otp", async (req, res) => {
  const { otpInput,email } = req.body;

  // Check if OTP exists for the given email
  if (!otpStore[email]) {
    return res.status(400).json({ success: false, message: 'OTP not generated for this email' });
  }

  // Check if OTP matches
  if (otpStore[email] !== otpInput) {
    return res.status(400).json({ success: false, message: 'Incorrect OTP' });
  }

  // OTP matched, delete it from storage
  delete otpStore[email];

  return res.status(200).json({ success: true, message: 'OTP verified successfully' });
});

// Reset password after OTP verification
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  // Check if the new password is provided
  if (!newPassword) {
      return res.status(400).json({ success: false, message: 'New password is required' });
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  const securePassword = await bcrypt.hash(newPassword, salt);

  try {
      // Find the user by email
      const user = await User.findOne({ Email: email });
      if (!user) {
          return res.status(400).json({ success: false, message: 'User not found' });
      }

      // Update the user's password
      user.Password = securePassword;
      await user.save();

      console.log('Password updated successfully for email:', email);

      // Respond with success
      return res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
      console.error('Error resetting password:', error);
      return res.status(500).json({ success: false, message: 'Failed to reset password', error: error.message });
  }
});
router.get('/:id/community', async (req, res) => {
  try {
    console.log("hello");
    const { id } = req.params; // Extract user id (Roll_no) from the URL

    const user = await User_Interests.findOne({ Roll_no: id }); // Find user by Roll_no
    const group_id = user.group_assigned;
    console.log(group_id);

    const group_members = await User_Interests.find({ group_assigned:group_id });

    console.log(group_members);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Return user data (excluding sensitive data like password)
    res.status(200).json({
      success: true,
      group_members
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user data' });
  }
});
//getUsers in chat
router.post("/checkuser", async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({});
    console.log(users);
    if (users.length > 0) {
      return res.status(200).json({ success: true, users });
    }
    
    return res.status(400).json({ success: false, message: 'No users found' });
  } catch (error) {
    console.error('Error during query:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;



