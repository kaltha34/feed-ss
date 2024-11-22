const Customer = require("../models/user_customerModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const customer = await Customer.login(username, password);

    // create a token
    const token = createToken(customer._id);

    res
      .status(200)
      .json({ message: "Customer logged in successfully", customer, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup user
const signupUser = async (req, res) => {
  const { username, password, fullName, email, phoneNumber, userType } = req.body;

  try {
    const customer = await Customer.signup(
      username,
      password,
      fullName,
      email,
      phoneNumber,
      userType
    );

    // create a token
    const token = createToken(customer._id);

    res
      .status(200)
      .json({ message: "Customer signed up successfully", customer, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  signupUser,
};
