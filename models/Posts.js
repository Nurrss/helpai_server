const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, get: (time) => time.toDateString() }
);

module.exports = mongoose.model("Posts", PostsSchema);
