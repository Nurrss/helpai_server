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
  },
  { timestamps: true, get: (time) => time.toDateString() }
);

module.exports = mongoose.model("Blogs", BlogsSchema);
