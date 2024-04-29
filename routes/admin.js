const router = require("express").Router();
const _ = require("lodash");

const Posts = require("../models/Posts");
const errorHandler = require("../middleware/errorHandler");

router.route("/posts").get(async (req, res) => {
  try {
    const posts = await Posts.find();
    res.status(200).json(posts);
  } catch (err) {
    errorHandler(err, req, res);
  }
});

router.post("/post/add", async (req, res) => {
  try {
    console.log(req);
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

router.get("/posts/:id", async (req, res) => {
  try {
    const postId = _.get(req, "params.id");
    if (!postId) {
      res.status(400).json({ message: "Id not found", success: false });
    } else {
      const post = await Posts.findById(postId);
      res.status(200).json(posts);
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/posts/:id", async (req, res) => {
  try {
    const postId = _.get(req, "params.id");
    const { title, description, show } = req.body;
    const updatedPost = await Posts.findByIdAndUpdate(postId, {
      title,
      description,
      show,
    });
    const updated = await updatedPost.save();
    res.status(200).json(updated);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/posts/:id", async (req, res) => {
  try {
    const postId = _.get(req, "params.id");
    if (!postId) {
      return res.status(400).json({ message: ` ID required.` });
    } else {
      await Posts.findByIdAndDelete(postId).then(
        res.status(200).json(`${postId} : was deleted`)
      );
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
