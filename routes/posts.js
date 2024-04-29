const router = require("express").Router();
const _ = require("lodash");

const Posts = require("../models/Posts");

router.get("/", async (req, res) => {
  try {
    const posts = await Posts.find();
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
