const express = require("express")

const {
    getCustomer,
    getSingleCustomer,
    deleteCustomer
} = require("../controllers/customerController");

const router = express.Router();

router.get("/customer", getCustomer);
router.get("/customer/:username", getSingleCustomer);
router.delete("/customer/:id", deleteCustomer);

module.exports = router;