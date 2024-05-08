const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const { hashConstance, ROLES } = require("../enums");
const Users = require("../models/Users");
const Admins = require("../models/Admins");
const Teachers = require("../models/Teachers");

const handleNewUser = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email)
    return res
      .status(400)
      .json({ message: "Email is required.", success: false });

  if (!password)
    return res
      .status(400)
      .json({ message: "Password is required.", success: false });

  if (!ROLES.includes(role))
    return res
      .status(400)
      .json({ message: "Invalid role specified.", success: false });

  try {
    const validateEmail = async (email) => {
      let user = await Users.findOne({ email });
      return user ? false : true;
    };

    let emailNotRegistered = await validateEmail(email);
    if (!emailNotRegistered) {
      return res.status(400).json({
        message: `Email is already registered.`,
        success: false,
      });
    }

    const hashedPwd = await bcrypt.hash(password, hashConstance);
    const newUser = new Users({
      email,
      password: hashedPwd,
      role,
    });
    const user = await newUser.save();

    if (role === "admin") {
      const admin = new Admins({ user: user._id });
      await admin.save();
    } else if (role === "teacher") {
      const teacher = new Teachers({ user: user._id });
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
