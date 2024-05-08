const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Users = require("../models/Users");
const Teachers = require("../models/Teachers"); // Import the Teachers model
const Admins = require("../models/Admins");

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const foundUser = await Users.findOne({ email: email }).exec();

  if (!foundUser) {
    return res.status(404).json({
      message: "User email is not found. Invalid login credentials.",
      success: false,
    });
  }

  const isMatch = await bcrypt.compare(password, foundUser.password);
  if (isMatch) {
    const { email, role, _id } = foundUser;
    const accessToken = jwt.sign(
      {
        UserInfo: {
          _id,
          email,
          role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1m" }
    );
    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "365d" }
    );

    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    let roleData = {};

    if (role === "teacher") {
      const teacher = await Teachers.findOne({ user: _id }).exec();
      roleData.teacherId = teacher ? teacher._id : null;
    }
    if (role === "admin") {
      const admin = await Admins.findOne({ user: _id }).exec();
      roleData.adminId = admin ? admin._id : null;
    }

    res.status(200).json({
      accessToken,
      refreshToken,
      success: true,
      userId: _id,
      role,
      ...roleData,
    });
  } else {
    res.status(403).json({
      message: "Incorrect password.",
      success: false,
    });
  }
};

module.exports = handleLogin;
