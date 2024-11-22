const express = require("express");

// controller function
const {
  getCompany,
  getSingleCompany,
  deleteCompany,
} = require("../controllers/companyController");

const router = express.Router();

router.get("/company", getCompany);
router.get("/company/:username", getSingleCompany);
router.delete("/company/:id", deleteCompany);

module.exports = router;
