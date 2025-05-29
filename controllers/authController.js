require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Users = require("../models/Users");
const Teachers = require("../models/Teachers");

const handleLogin = async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const foundUser = await Users.findOne({ name: name }).exec();

  if (!foundUser) {
    return res.status(404).json({
      message: "User is not found. Invalid login credentials.",
      success: false,
    });
  }

  const isMatch = await bcrypt.compare(password, foundUser.password);
  if (isMatch) {
    const { name, role, _id } = foundUser;
    const accessToken = jwt.sign(
      {
        UserInfo: { _id, name, role },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "999m" }
    );

    const refreshToken = jwt.sign({ name }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "365d",
    });

    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    let roleData = {};

    if (role === "teacher") {
      const teacher = await Teachers.findOne({ user: _id }).exec();
      roleData.teacherId = teacher ? teacher._id : null;
    }
    roleData.userId = foundUser._id;

    res.status(200).json({
      foundUser,
    });
  } else {
    res.status(403).json({
      message: "Incorrect password.",
      success: false,
    });
  }
};

module.exports = handleLogin;
