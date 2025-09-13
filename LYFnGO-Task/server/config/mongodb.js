const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.DATABASE)
    .then(() => {
      console.log("database is connected");
    })
    .catch(() => {
      console.log("database is not connected");
    });
};

module.exports = connectDB;
