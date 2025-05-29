const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const { hashConstance, ROLES } = require("../enums");
const Users = require("../models/Users");
const Teachers = require("../models/Teachers");
require("dotenv").config();

const handleNewUser = async (req, res) => {
  const { telegram_id, password, role, name } = req.body;

  if (!telegram_id)
    return res
      .status(400)
      .json({ message: "Telegram ID is required.", success: false });

  if (!password)
    return res
      .status(400)
      .json({ message: "Password is required.", success: false });

  if (!ROLES.includes(role))
    return res
      .status(400)
      .json({ message: "Invalid role specified.", success: false });

  try {
    const existingUser = await Users.findOne({ telegram_id });
    if (existingUser) {
      return res.status(400).json({
        message: `User is already registered.`,
        success: false,
      });
    }

    const hashedPwd = await bcrypt.hash(password, hashConstance);
    const newUser = new Users({
      telegram_id,
      password: hashedPwd,
      role,
      name,
    });
    const user = await newUser.save();

    if (role === "teacher") {
      const teacher = new Teachers({ user: user._id, name: name });
      await teacher.save();
    }

    res
      .status(200)
      .json({ user, message: "User created successfully with role: " + role });
  } catch (err) {
    return res.status(500).json({ message: `${err.message}` });
  }
};

module.exports = handleNewUser;
