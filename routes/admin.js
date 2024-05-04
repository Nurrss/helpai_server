const router = require("express").Router();
const _ = require("lodash");

const Questions = require("../models/Questions");
const Quotes = require("../models/Quote");
const Blogs = require("../models/Blogs");

const errorHandler = require("../middleware/errorHandler");

/**
 * @swagger
 * api/admin/questions:
 *   get:
 *     tags: [Admin]
 *     summary: "Get all questions"
 *     responses:
 *       200:
 *         description: "A list of questions retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 *
 * @swagger
 * api/admin/question/add:
 *   post:
 *     tags: [Admin]
 *     summary: "Add a new question"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       200:
 *         description: "New question added successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *
 * @swagger
 * api/admin/questions/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: "Get a single question by ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Question retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *   put:
 *     tags: [Admin]
 *     summary: "Update a question by ID"
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
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       200:
 *         description: "Question updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *   delete:
 *     tags: [Admin]
 *     summary: "Delete a question by ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Question deleted successfully"
 *
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - tellNumber
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         tellNumber:
 *           type: string
 *         show:
 *           type: boolean
 *           default: false
 */

// Questions Route
router.route("/questions").get(async (req, res) => {
  try {
    const questions = await Questions.find();
    res.status(200).json(questions);
  } catch (err) {
    errorHandler(err, req, res);
  }
});

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

router.get("/questions/:id", async (req, res) => {
  try {
    const questionId = _.get(req, "params.id");
    if (!questionId) {
      res.status(400).json({ message: "Id not found", success: false });
    } else {
      const question = await Questions.findById(questionId);
      res.status(200).json(question);
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/questions/:id", async (req, res) => {
  try {
    const questionId = _.get(req, "params.id");
    const { title, description, show, tellNumber, answer } = req.body;
    const updatedQuestion = await Questions.findByIdAndUpdate(questionId, {
      title,
      description,
      show,
      tellNumber,
      answer,
    });
    const updated = await updatedQuestion.save();
    res.status(200).json(updated);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/questions/:id", async (req, res) => {
  try {
    const questionId = _.get(req, "params.id");
    if (!questionId) {
      return res.status(400).json({ message: ` ID required.` });
    } else {
      await Questions.findByIdAndDelete(questionId).then(
        res.status(200).json(`${questionId} : was deleted`)
      );
    }
  } catch (err) {
    console.log(err);
  }
});

/**
 * @swagger
 * api/admin/quotes:
 *   get:
 *     tags: [Admin]
 *     summary: "Get all quotes"
 *     responses:
 *       200:
 *         description: "A list of all quotes"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quote'
 *
 * @swagger
 * api/admin/quote/add:
 *   post:
 *     tags: [Admin]
 *     summary: "Add a new quote"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quote'
 *     responses:
 *       200:
 *         description: "New quote added successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quote'
 *
 * @swagger
 * api/admin/quotes/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: "Get a single quote by ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Quote retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quote'
 *   put:
 *     tags: [Admin]
 *     summary: "Update a quote by ID"
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
 *             $ref: '#/components/schemas/Quote'
 *     responses:
 *       200:
 *         description: "Quote updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quote'
 *   delete:
 *     tags: [Admin]
 *     summary: "Delete a quote by ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Quote deleted successfully"
 *
 * components:
 *   schemas:
 *     Quote:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         show:
 *           type: boolean
 *           default: false
 */

// Quotes Route

router.route("/quotes").get(async (req, res) => {
  try {
    const quotes = await Quotes.find();
    res.status(200).json(quotes);
  } catch (err) {
    errorHandler(err, req, res);
  }
});

router.post("/quote/add", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newQuotes = new Quotes({
      title,
      description,
    });
    await newQuotes.save();
    res.status(200).json(newQuotes);
  } catch (error) {
    console.log(error);
  }
});

router.get("/quotes/:id", async (req, res) => {
  try {
    const quoteId = _.get(req, "params.id");
    if (!quoteId) {
      res.status(400).json({ message: "Id not found", success: false });
    } else {
      const quote = await Quotes.findById(quoteId);
      res.status(200).json(quote);
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/quotes/:id", async (req, res) => {
  try {
    const quoteId = _.get(req, "params.id");
    const { title, description, show } = req.body;
    const updatedQuotes = await Quotes.findByIdAndUpdate(quoteId, {
      title,
      description,
      show,
    });
    const updated = await updatedQuotes.save();
    res.status(200).json(updated);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/quotes/:id", async (req, res) => {
  try {
    const quoteId = _.get(req, "params.id");
    if (!quoteId) {
      return res.status(400).json({ message: ` ID required.` });
    } else {
      await Quotes.findByIdAndDelete(quoteId).then(
        res.status(200).json(`${quoteId} : was deleted`)
      );
    }
  } catch (err) {
    console.log(err);
  }
});

/**
 * @swagger
 * api/admin/blogs:
 *   get:
 *     tags: [Admin]
 *     summary: "Get all blogs"
 *     responses:
 *       200:
 *         description: "A list of blogs"
 *         content:
 *           application/json:
 *             schema:
 *               type: "array"
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 *
 * @swagger
 * api/admin/blog/add:
 *   post:
 *     tags: [Admin]
 *     summary: "Add a new blog"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       200:
 *         description: "New blog added successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *
 * @swagger
 * api/admin/blogs/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: "Get a single blog by ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Blog retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *   put:
 *     tags: [Admin]
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
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       200:
 *         description: "Blog updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *   delete:
 *     tags: [Admin]
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
 *
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

router.post("/blog/add", async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    const newBlog = new Blogs({
      title,
      description,
      imageUrl,
    });
    await newBlog.save();
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
