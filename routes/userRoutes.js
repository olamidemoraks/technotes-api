const express = require("express");
const {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
router.use(verifyJWT);

router.route("/").get(getAllUsers).post(createNewUser);
router.route("/").patch(updateUser).delete(deleteUser);

module.exports = router;
