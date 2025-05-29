const mongoose = require("mongoose");
const { Schema } = mongoose;

const LessonsSchema = new Schema({
  title: String,
  content: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Courses" },
  link: String,
});

module.exports = mongoose.model("Lessons", LessonsSchema);
