const router = require("express").Router();
const _ = require("lodash");

const Questions = require("../models/Questions");
const Quotes = require("../models/Quote");
const Blogs = require("../models/Blogs");

const errorHandler = require("../middleware/errorHandler");

/**
 * @swagger
 * api/public/question/add:
 *   post:
 *     tags: [Public]
 *     summary: "Add a new question"
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
 *               tellNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: "New question added successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 */

/**
 * @swagger
 * api/public/questions:
 *   get:
 *     tags: [Public]
 *     summary: "Get all questions that are marked as 'show'"
 *     responses:
 *       200:
 *         description: "List of visible questions"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 */

/**
 * @swagger
 * api/public/quotes/add:
 *   post:
 *     tags: [Public]
 *     summary: "Add a new quote"
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
 *     responses:
 *       200:
 *         description: "New quote added successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quote'
 */

/**
 * @swagger
 * api/public/quotes:
 *   get:
 *     tags: [Public]
 *     summary: "Get all quotes that are marked as 'show'"
 *     responses:
 *       200:
 *         description: "List of visible quotes"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quote'
 */

// Questions Route
router.post("/question/add", async (req, res) => {
  try {
    const { title, description, tellNumber } = req.body;
    const newQuestion = new Questions({
      title,
      description,
      tellNumber,
    });
    await newQuestion.save();
    res.status(200).json(newQuestion);
  } catch (error) {
    console.log(error);
  }
});

router.get("/questions", async (req, res) => {
  try {
    const questions = await Questions.find({ show: true });
    res.status(200).json(questions);
  } catch (err) {
    errorHandler(err, req, res);
  }
});

// Quotes Route
router.post("/quotes/add", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newQuote = new Quotes({
      title,
      description,
    });
    await newQuote.save();
    res.status(200).json(newQuote);
  } catch (error) {
    console.log(error);
  }
});

router.get("/quotes", async (req, res) => {
  try {
    const quotes = await Quotes.find({ show: true });
    res.status(200).json(quotes);
  } catch (err) {
    errorHandler(err, req, res);
  }
});

/**
 * @swagger
 * api/public/blogs:
 *   get:
 *     tags: [Public]
 *     summary: "Get all blogs that admin created"
 *     responses:
 *       200:
 *         description: "List of blogs"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 */

// Blogs Route
router.route("/blogs").get(async (req, res) => {
  try {
    const blogs = await Blogs.find();
    res.status(200).json(blogs);
  } catch (err) {
    errorHandler(err, req, res);
  }
});

module.exports = router;
