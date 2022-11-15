const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, { family: 4 });
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
