const router = require("express").Router();
const _ = require("lodash");

const Question = require("../models/Questions");

router.get("/", async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
