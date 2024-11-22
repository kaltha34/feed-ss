const express = require('express');

// controller function
const { loginUser, signupUser } = require ('../controllers/userController_customer.js')

const router = express.Router();


// login route
router.post('/login-customer', loginUser)

// signup route
router.post('/signup-customer', signupUser)




module.exports = router;