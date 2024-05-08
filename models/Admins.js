const { Schema, model } = require("mongoose");

const AdminsSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Users" },
});

module.exports = model("Admins", AdminsSchema);
