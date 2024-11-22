const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  profile: {
    description: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  qrCode: {
    type: String,
    unique: true,
  },
  userType: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
companySchema.pre("save", async function (next) {
  this.updatedAt = Date.now();
  next();
});

// Static signup method with all fields
companySchema.statics.signup = async function (
  username,
  password,
  name,
  profile,
  qrCode,
  userType
) {
  if (!username || !password) {
    throw Error("All feilds must be filled");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not strong enough");
  }

  const exists = await this.findOne({ username });

  if (exists) {
    throw Error("Username already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // Create a new company with all details
  const company = await this.create({
    username,
    password: hash,
    name,
    profile,
    qrCode,
    userType
  });

  return company;
};

// static login method
companySchema.statics.login = async function (username, password) {
  if (!username || !password) {
    throw Error("All feilds must be filled");
  }

  const company = await this.findOne({ username });

  if (!company) {
    throw Error("Incorrect username");
  }

  const match = await bcrypt.compare(password, company.password)

  if (!match){
    throw Error("Incorrect password");
  }

  return company
};

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
