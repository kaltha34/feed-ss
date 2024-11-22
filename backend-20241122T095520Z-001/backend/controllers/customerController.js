const Customer = require("../models/user_customerModel");
const mongoose = require("mongoose");

const getCustomer = async (req, res) => {
  const customer = await Customer.find({}).sort({ createdAt: -1 });
  res.status(200).json(customer);
};

const getSingleCustomer = async (req, res) => {
  const username = req.params.username; // Accessing username from URL parameter

  const customer = await Customer.findOne({ username });

  if (!customer) {
    return res.status(404).json({ error: "No such customer" });
  }

  res.status(200).json(customer);
};


const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such customer" });
  }

  const customer = await Company.findByIdAndDelete({ _id: id });

  if (!customer) {
    return res.status(400).json({ error: "No such customer" });
  }

  res.status(200).json(customer);
};

// // update a tour
// const updateTour = async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(404).json({ error: "No such Tour...." });
//   }

//   const tour = await Tour.findByIdAndUpdate(
//     { _id: id },
//     {
//       ...req.body,
//     }
//   );

//   if (!tour) {
//     return res.status(400).json({ error: "No such Tour" });
//   }

//   res.status(200).json(tour);
// };

module.exports = {
    getCustomer,
    getSingleCustomer,
    deleteCustomer
};
