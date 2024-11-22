require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const userCompanyRoutes = require("./routes/userCompany");
const userCustomerRoutes = require("./routes/userCustomer");
const companyRoutes = require("./routes/company");
const customerRoutes = require("./routes/customer");
const reviewRoutes = require("./routes/review");
const emailRoutes = require("./routes/email");

const app = express();

// middleware
app.use(express.json());  
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/user", userCompanyRoutes);
app.use("/user", userCustomerRoutes);
app.use("/", companyRoutes);
app.use("/", customerRoutes);
app.use("/", reviewRoutes);
app.use("/", emailRoutes);

// connect to the database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log(
        "connected to the db & listening on port no",
        process.env.PORT
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });
