const mongoose = require("mongoose");
const { Schema } = mongoose;

const CoursesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    durability: {
      type: String,
      required: true,
    },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lessons" }],
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teachers" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Courses", CoursesSchema);
