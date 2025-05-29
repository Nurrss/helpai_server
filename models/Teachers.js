const { Schema, model } = require("mongoose");

const TeachersSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Users" },
  name: {
    type: String,
    required: true,
  },
  courses: [{ type: Schema.Types.ObjectId, ref: "Courses" }],
});

module.exports = model("Teachers", TeachersSchema);
