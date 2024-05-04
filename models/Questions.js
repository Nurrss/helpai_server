const mongoose = require("mongoose");
const { Schema } = mongoose;

const QuestionsSchema = new Schema(
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
    tellNumber: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
    },
  },
  { timestamps: true, get: (time) => time.toDateString() }
);

module.exports = mongoose.model("Questions", QuestionsSchema);
