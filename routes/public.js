const router = require("express").Router();
const _ = require("lodash");

const Posts = require("../models/Posts");

const errorHandler = require("../middleware/errorHandler");

router.post("/post/add", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newPost = new Posts({
      title,
      description,
    });
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    console.log(error);
  }
});

router.get("/posts", async (req, res) => {
  try {
    const posts = await Posts.find({ show: true });
    res.status(200).json(posts);
  } catch (err) {
    errorHandler(err, req, res);
  }
});

module.exports = router;
