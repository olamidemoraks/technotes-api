const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username must be provided"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password must be provided"],
  },
  roles: {
    type: [String],
    default: ["Employee"],
  },

  active: {
    type: Boolean,
    default: true,
  },
});

// UserSchema.pre("save", async function (next) {
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

module.exports = mongoose.model("User", UserSchema);
