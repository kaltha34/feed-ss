const express = require("express");

const { sendEmail } = require("../controllers/emailController");

const router = express.Router();

const requireAuth = require('../middleware/requireAuth');
const requireAuth2 = require('../middleware/requireAuth2');




router.post("/send-email",requireAuth, sendEmail);
router.post("/send-email-company",requireAuth2, sendEmail);

module.exports = router;
