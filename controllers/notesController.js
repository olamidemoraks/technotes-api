const Note = require("../models/Note");
const User = require("../models/User");
const getAllNotes = async (req, res) => {
  const notes = await Note.find().sort("completed").lean();
  if (!notes?.length) {
    return res.status(400).json({ message: "No notes found" });
  }

  const noteWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return {
        ...note,
        username: user.username,
      };
    })
  );
  res.status(200).json(noteWithUser);
};

const getNote = async (req, res) => {
  const { id } = req.params;
  const note = await Note.findById(id);
  if (!note) {
    return res.status(404).json({ message: "Note does not exist" });
  }

  res.status(200).json(note);
};

const createNote = async (req, res) => {
  const { user, title, text, completed } = req.body;
  if (!user || !title || !text) {
    return res.status(400).json({ message: "All field are required" });
  }

  const duplicate = await Note.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate note title" });
  }

  const noteValue = { user, title, text, completed };
  const createdNote = await Note.create(noteValue);

  if (!createdNote) {
    return res.status(400).json({ message: "Invalid note data received" });
  }

  res.status(201).json({ message: `New note created` });
};

const updateNote = async (req, res) => {
  //   const { id } = req.params;
  const { id, user, title, text, completed } = req.body;

  if (!id || !user || !title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }

  const note = await Note.findById(id);
  if (!note) {
    return res.status(400).json({ message: "Note Not Found" });
  }

  // Check for duplicate title
  const duplicate = await Note.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  // Allow renaming of the original note
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate note title" });
  }
  note.title = title;
  note.text = text;
  note.completed = completed;
  note.user = user;

  const updatedNote = await note.save();

  res.json({ message: `Note updated` });
};

const deleteNote = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Note ID required" });
  }

  const note = await Note.findById(id).exec();
  if (!note) {
    return res.status(400).json({ message: "Note Not Found" });
  }

  const result = await note.deleteOne();
  const reply = `Note ${result.title} with ID ${result._id} deleted`;

  res.json(reply);
};

module.exports = {
  getAllNotes,
  getNote,
  updateNote,
  deleteNote,
  createNote,
};
