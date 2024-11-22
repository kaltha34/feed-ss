const express = require("express");

// controller function
const {
  loginUser,
  signupUser,
} = require("../controllers/userController_company.js");

const router = express.Router();

// login route
router.post("/login-company", loginUser);

// signup route
router.post("/signup-company", signupUser);

module.exports = router;
