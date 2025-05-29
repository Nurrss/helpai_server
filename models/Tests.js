const mongoose = require("mongoose");
const { Schema } = mongoose;

const TestsSchema = new Schema(
  {
    test_answers: [{ type: String, required: true }],
    user: { type: Schema.Types.ObjectId, ref: "Users" },
  },
  { timestamps: true, get: (time) => time.toDateString() }
);

module.exports = mongoose.model("Tests", TestsSchema);
