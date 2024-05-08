const router = require("express").Router();
const _ = require("lodash");

const Questions = require("../models/Questions");
const Quotes = require("../models/Quote");
const Blogs = require("../models/Blogs");

const errorHandler = require("../middleware/errorHandler");
const Teachers = require("../models/Teachers");

/**
 * @swagger
 * /teacher/blogs:
 *   get:
 *     tags: [Teacher]
 *     summary: "Get all blogs associated with a specific teacher"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teacherId:
 *                 type: string
 *                 description: "The ID of the teacher whose blogs are to be retrieved"
 *     responses:
 *       200:
 *         description: "A list of blogs managed by the specified teacher"
 *         content:
 *           application/json:
 *             schema:
 *               type: "array"
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 *
 * @swagger
 * /teacher/blog/add:
 *   post:
 *     tags: [Teacher]
 *     summary: "Add a new blog for a teacher"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       200:
 *         description: "New blog created successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *
 * @swagger
 * /teacher/blogs/{id}:
 *   get:
 *     tags: [Teacher]
 *     summary: "Retrieve a specific blog by ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Specific blog data"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *   put:
 *     tags: [Teacher]
 *     summary: "Update a blog by ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: "Blog updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *   delete:
 *     tags: [Teacher]
 *     summary: "Delete a blog by ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Blog deleted successfully"
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - imageUrl
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         imageUrl:
 *           type: string
 *         user:
 *           type: string
 *           description: "The ID of the user who owns the blog"
 *         teacher:
 *           type: string
 *           description: "The ID of the teacher associated with the blog"
 */

// Blogs Route

router.route("/blogs").get(async (req, res) => {
  try {
    const { teacherId } = req.body;
    const blogs = await Blogs.find({ teacher: teacherId });
    res.status(200).json(blogs);
  } catch (err) {
    errorHandler(err, req, res);
  }
});

router.post("/blog/add", async (req, res) => {
  try {
    const { title, description, imageUrl, userId, teacherId } = req.body;
    const newBlog = new Blogs({
      title,
      description,
      imageUrl,
      user: userId,
      teacher: teacherId,
    });
    await newBlog.save();

    const teacher = await Teachers.findById(teacherId);
    teacher.blogs.push(newBlog._id);
    await teacher.save();
    res.status(200).json(newBlog);
  } catch (error) {
    console.log(error);
  }
});

router.get("/blogs/:id", async (req, res) => {
  try {
    const blodId = _.get(req, "params.id");
    if (!blodId) {
      res.status(400).json({ message: "Id not found", success: false });
    } else {
      const blog = await Blogs.findById(blodId);
      res.status(200).json(blog);
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/blogs/:id", async (req, res) => {
  try {
    const blodId = _.get(req, "params.id");
    const { title, description, imageUrl } = req.body;
    const updatedBlog = await Blogs.findByIdAndUpdate(blodId, {
      title,
      description,
      imageUrl,
    });
    const updated = await updatedBlog.save();
    res.status(200).json(updated);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/blogs/:id", async (req, res) => {
  try {
    const blodId = _.get(req, "params.id");
    if (!blodId) {
      return res.status(400).json({ message: ` ID required.` });
    } else {
      await Blogs.findByIdAndDelete(blodId).then(
        res.status(200).json(`${blodId} : was deleted`)
      );
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
