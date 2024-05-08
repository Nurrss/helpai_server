const mongoose = require("mongoose");
const { Schema } = mongoose;

const BlogsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teachers" },
  },
  { timestamps: true, get: (time) => time.toDateString() }
);

module.exports = mongoose.model("Blogs", BlogsSchema);
