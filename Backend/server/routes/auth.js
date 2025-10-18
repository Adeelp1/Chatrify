'use strict';

const express = require("express");
const router = express.Router();
const {
    signupUser,
    loginUser,
    autoLoign,
    logoutUser
} = require("../controllers/authController");

// Auto login route
router.post("/", autoLoign);

// Signup route
router.post("/signup", signupUser);

// Login route
router.post("/login", loginUser);

// Logout route
router.post("/logout", logoutUser);


module.exports = router;