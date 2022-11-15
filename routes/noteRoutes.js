const express = require("express");
const { get } = require("mongoose");
const {
  getAllNotes,
  getNote,
  updateNote,
  createNote,
  deleteNote,
} = require("../controllers/notesController");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router.use(verifyJWT);
router.route("/").get(getAllNotes).post(createNote);
router.route("/").get(getNote).patch(updateNote).delete(deleteNote);

module.exports = router;
