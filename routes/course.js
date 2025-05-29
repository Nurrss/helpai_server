const router = require("express").Router();
const _ = require("lodash");

const Courses = require("../models/Courses");

/**
 * @swagger
 * /api/courses:
 *   get:
 *     tags: [Courses]
 *     summary: "Get all courses"
 *     responses:
 *       200:
 *         description: "A list of courses retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *
 * @swagger
 * /api/courses/add:
 *   post:
 *     tags: [Courses]
 *     summary: "Add a new course"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: "New course added successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     tags: [Courses]
 *     summary: "Get a single course by ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Course retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *
 *   put:
 *     tags: [Courses]
 *     summary: "Update a course by ID"
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
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: "Course updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *
 *   delete:
 *     tags: [Courses]
 *     summary: "Delete a course by ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Course deleted successfully"
 *
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - durability
 *       properties:
 *         title:
 *           type: string
 *           example: "Frontend Development"
 *         description:
 *           type: string
 *           example: "A complete frontend dev course using React and Tailwind."
 *         durability:
 *           type: string
 *           example: "6 weeks"
 *         lessons:
 *           type: array
 *           items:
 *             type: string
 *             description: "Lesson ObjectId"
 *           example: ["6630fdb1c6345a1a04c7a58b"]
 *         teacher:
 *           type: string
 *           description: "Teacher ObjectId"
 *           example: "6630fde9c6345a1a04c7a5a2"
 */

// GET all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Courses.find();
    res.status(200).json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ADD course
router.post("/add", async (req, res) => {
  try {
    const { title, description, durability, teacher } = req.body;
    const newCourse = new Courses({
      title,
      description,
      durability,
      teacher,
    });
    await newCourse.save();
    res.status(200).json(newCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating course" });
  }
});

// GET course by ID
router.get("/:id", async (req, res) => {
  try {
    const courseId = _.get(req, "params.id");
    if (!courseId) {
      return res.status(400).json({ message: "Id not provided" });
    }
    const course = await Courses.findById(courseId).populate("lessons teacher");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching course" });
  }
});

// UPDATE course
router.put("/:id", async (req, res) => {
  try {
    const courseId = _.get(req, "params.id");
    const { title, description, durability } = req.body;
    const updated = await Courses.findByIdAndUpdate(
      courseId,
      { title, description, durability },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating course" });
  }
});

// DELETE course
router.delete("/:id", async (req, res) => {
  try {
    const courseId = _.get(req, "params.id");
    if (!courseId) {
      return res.status(400).json({ message: `ID required.` });
    }
    await Courses.findByIdAndDelete(courseId);
    res.status(200).json({ message: `${courseId} was deleted` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting course" });
  }
});

module.exports = router;
