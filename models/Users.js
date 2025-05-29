const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const UsersSchema = new Schema(
  {
    telegram_id: {
      type: Number,
      trim: true,
      required: true,
      unique: true,
    },
    name: String,
    password: {
      type: String,
      trim: true,
      required: true,
      validate: [
        {
          validator: function (value) {
            return value.length >= 6;
          },
          msg: "Password length must be at least 6 characters",
        },
      ],
    },
    refreshToken: String,
    role: {
      type: String,
      enum: ["user", "teacher"],
      required: true,
    },
    course: { type: Schema.Types.ObjectId, ref: "Courses" },
    tests: [{ type: Schema.Types.ObjectId, ref: "Tests" }],
    professions: [{ type: Schema.Types.ObjectId, ref: "Professions" }],
  },
  { timestamps: true }
);

UsersSchema.methods.isValidRefreshToken = function (providedRefreshToken) {
  return this.refreshToken === providedRefreshToken;
};

module.exports = mongoose.model("Users", UsersSchema);
