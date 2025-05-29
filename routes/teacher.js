const router = require("express").Router();
const _ = require("lodash");

const errorHandler = require("../middleware/errorHandler");
const Teachers = require("../models/Teachers");
const Courses = require("../models/Courses");

/**
 * @swagger
 * /api/teachers:
 *   get:
 *     tags: [Teachers]
 *     summary: "Get all teachers"
 *     responses:
 *       200:
 *         description: "A list of teachers retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 *
 * @swagger
 * /api/teacher/add:
 *   post:
 *     tags: [Teachers]
 *     summary: "Add a new teacher"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       200:
 *         description: "New teacher added successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *
 * @swagger
 * /api/teachers/{id}:
 *   get:
 *     tags: [Teachers]
 *     summary: "Get a single teacher by ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Teacher retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *
 *   put:
 *     tags: [Teachers]
 *     summary: "Update a teacher by ID"
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
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       200:
 *         description: "Teacher updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *
 *   delete:
 *     tags: [Teachers]
 *     summary: "Delete a teacher by ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Teacher deleted successfully"
 *
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       required:
 *         - name
 *         - user
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *         user:
 *           type: string
 *           description: "ObjectId of associated user"
 *           example: "665aefdbc49b9d1f08b173e1"
 *         courses:
 *           type: array
 *           items:
 *             type: string
 *             description: "Course ObjectId"
 *           example: ["665aefdbc49b9d1f08b173e5"]
 */

router.route("/courses").get(async (req, res) => {
  try {
    const courses = await Courses.find();
    res.status(200).json(courses);
  } catch (err) {
    errorHandler(err, req, res);
  }
});

router.post("/course/add", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newCourses = new Courses({
      title,
      description,
    });
    await newCourses.save();
    res.status(200).json(newCourses);
  } catch (error) {
    console.log(error);
  }
});

router.get("/courses/:id", async (req, res) => {
  try {
    const courseId = _.get(req, "params.id");
    if (!quoteId) {
      res.status(400).json({ message: "Id not found", success: false });
    } else {
      const course = await Courses.findById(courseId);
      res.status(200).json(course);
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/course/:id", async (req, res) => {
  try {
    const courseId = _.get(req, "params.id");
    const { title, description, show } = req.body;
    const updatedCourse = await Courses.findByIdAndUpdate(courseId, {
      title,
      description,
      show,
    });
    const updated = await updatedCourse.save();
    res.status(200).json(updated);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/courses/:id", async (req, res) => {
  try {
    const courseId = _.get(req, "params.id");
    if (!courseId) {
      return res.status(400).json({ message: ` ID required.` });
    } else {
      await Courses.findByIdAndDelete(courseId).then(
        res.status(200).json(`${courseId} : was deleted`)
      );
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
