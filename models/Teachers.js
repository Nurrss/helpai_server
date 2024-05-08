const { Schema, model } = require("mongoose");

const TeachersSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Users" },
  blogs: [{ type: Schema.Types.ObjectId, ref: "Blogs" }],
});

module.exports = model("Teachers", TeachersSchema);
