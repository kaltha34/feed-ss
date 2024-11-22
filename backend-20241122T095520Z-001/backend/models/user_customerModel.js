const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const customerSchema = new mongoose.Schema({
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
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
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
});

// Static signup method
customerSchema.statics.signup = async function (
  username,
  password,
  fullName,
  email,
  phoneNumber,
  userType
) {
  if (!username || !password) {
    throw Error("All feilds must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
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

  // Create a new customer with provided details
  const customer = await this.create({
    username,
    password: hash,
    fullName,
    email,
    phoneNumber,
    userType
  });

  return customer;
};


// static login method
customerSchema.statics.login = async function (username, password) {
    if (!username || !password) {
      throw Error("All feilds must be filled");
    }
  
    const customer = await this.findOne({ username });
  
    if (!customer) {
      throw Error("Incorrect username");
    }
  
    const match = await bcrypt.compare(password, customer.password)
  
    if (!match){
      throw Error("Incorrect password");
    }
  
    return customer;
  };


const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
