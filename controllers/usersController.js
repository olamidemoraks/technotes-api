const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  const user = await User.find().select("-password").lean();
  if (!user?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.status(200).json(user);
};

const createNewUser = async (req, res) => {
  const { username, password, roles } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All field are required" });
  }

  const duplicate = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);

  const userObject =
    !Array.isArray(roles) || !roles.length
      ? { username, password: newPassword }
      : { username, password: newPassword, roles };
  const user = await User.create(userObject);
  if (!user) {
    return res.status(400).json({ message: "Invalid user data received" });
  }

  return res.status(201).json({ message: `New user ${username} created` });
};

const updateUser = async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User Not Found" });
  }

  const duplicate = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated` });
};

const deleteUser = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  const note = await Note.findOne({ user: id }).lean();
  if (note) {
    return res.status(400).json({ message: "User has assign notes" });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();
  const reply = `Username ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
