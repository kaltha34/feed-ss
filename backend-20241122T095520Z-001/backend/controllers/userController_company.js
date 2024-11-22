const Company = require("../models/user_companyModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const company = await Company.login(username, password);

    // create a token
    const token = createToken(company._id);

    res
      .status(200)
      .json({ message: "Company logged in successfully", company, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup user
const signupUser = async (req, res) => {
  const { username, password, name, profile, qrCode, userType } = req.body;

  try {
    const company = await Company.signup(
      username,
      password,
      name,
      profile,
      qrCode,
      userType
    );

    // create a token
    const token = createToken(company._id);

    res
      .status(200)
      .json({ message: "Company signed up successfully", company, token });
  } catch (error) {
    // Handle errors (e.g., username already in use)
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  signupUser,
};
