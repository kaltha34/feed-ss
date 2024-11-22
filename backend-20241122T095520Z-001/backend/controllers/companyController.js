const Company = require("../models/user_companyModel");
const mongoose = require("mongoose");

const getCompany = async (req, res) => {
  const company = await Company.find({}).sort({ createdAt: -1 });
  res.status(200).json(company);
};

const getSingleCompany = async (req, res) => {
  const username = req.params.username; // Accessing username from URL parameter

  const company = await Company.findOne({ username });

  if (!company) {
    return res.status(404).json({ error: "No such company" });
  }

  res.status(200).json(company);
};


const deleteCompany = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such company" });
  }

  const company = await Company.findByIdAndDelete({ _id: id });

  if (!company) {
    return res.status(400).json({ error: "No such company" });
  }

  res.status(200).json(company);
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
    getCompany,
    getSingleCompany,
    deleteCompany
};
