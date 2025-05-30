const router = require("express").Router();
const _ = require("lodash");

const Lessons = require("../models/Lessons");

/**
 * @swagger
 * /api/lessons:
 *   get:
 *     tags: [Lessons]
 *     summary: "Get all lessons"
 *     responses:
 *       200:
 *         description: "A list of lessons retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 *
 * @swagger
 * /api/lessons/add:
 *   post:
 *     tags: [Lessons]
 *     summary: "Add a new lesson"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lesson'
 *     responses:
 *       200:
 *         description: "New lesson added successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *
 * @swagger
 * /api/lessons/{id}:
 *   get:
 *     tags: [Lessons]
 *     summary: "Get a single lesson by ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Lesson retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *
 *   put:
 *     tags: [Lessons]
 *     summary: "Update a lesson by ID"
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
 *             $ref: '#/components/schemas/Lesson'
 *     responses:
 *       200:
 *         description: "Lesson updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *
 *   delete:
 *     tags: [Lessons]
 *     summary: "Delete a lesson by ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Lesson deleted successfully"
 *
 * components:
 *   schemas:
 *     Lesson:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - course
 *       properties:
 *         title:
 *           type: string
 *           example: "Intro to JavaScript"
 *         content:
 *           type: string
 *           example: "Variables, loops, and functions explained..."
 *         course:
 *           type: string
 *           description: "ObjectId of the related course"
 *           example: "6630fdeb7a7c4e1a2c9b8f22"
 *         link:
 *           type: string
 *           format: uri
 *           example: "https://youtube.com/example"
 */

// GET all lessons
router.get("/", async (req, res) => {
  try {
    const lessons = await Lessons.find().populate("course");

    // Получаем все уроки по courseId
    const courseLessonsMap = {};

    // Собираем ссылки по каждому курсу
    lessons.forEach((lesson) => {
      const courseId = lesson.course._id.toString();
      if (!courseLessonsMap[courseId]) {
        courseLessonsMap[courseId] = [];
      }
      courseLessonsMap[courseId].push(lesson.link);
    });

    // Заменяем course.lessons на ссылки
    const modifiedLessons = lessons.map((lesson) => {
      const modifiedCourse = {
        ...lesson.course.toObject(),
        lessons: courseLessonsMap[lesson.course._id.toString()],
      };

      return {
        ...lesson.toObject(),
        course: modifiedCourse,
      };
    });

    res.status(200).json(modifiedLessons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ADD lesson
router.post("/add", async (req, res) => {
  try {
    const { title, content, course, link } = req.body;
    const newLesson = new Lessons({
      title,
      content,
      course,
      link,
    });
    await newLesson.save();
    res.status(200).json(newLesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating lesson" });
  }
});

// GET lesson by ID
router.get("/:id", async (req, res) => {
  try {
    const lessonId = _.get(req, "params.id");
    if (!lessonId) {
      return res.status(400).json({ message: "Id not provided" });
    }
    const lesson = await Lessons.findById(lessonId).populate("course");
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    res.status(200).json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching lesson" });
  }
});

// UPDATE lesson
router.put("/:id", async (req, res) => {
  try {
    const lessonId = _.get(req, "params.id");
    const { title, content, course, link } = req.body;
    const updated = await Lessons.findByIdAndUpdate(
      lessonId,
      { title, content, course, link },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating lesson" });
  }
});

// DELETE lesson
router.delete("/:id", async (req, res) => {
  try {
    const lessonId = _.get(req, "params.id");
    if (!lessonId) {
      return res.status(400).json({ message: `ID required.` });
    }
    await Lessons.findByIdAndDelete(lessonId);
    res.status(200).json({ message: `${lessonId} was deleted` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting lesson" });
  }
});

module.exports = router;
