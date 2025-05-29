const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProfessionsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    course: { type: Schema.Types.ObjectId, ref: "Courses" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Professions", ProfessionsSchema);
