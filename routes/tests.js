const router = require("express").Router();
const _ = require("lodash");

const Tests = require("../models/Tests");

/**
 * @swagger
 * /api/tests:
 *   get:
 *     tags: [Tests]
 *     summary: "Get all tests"
 *     responses:
 *       200:
 *         description: "A list of tests retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Test'
 *
 * @swagger
 * /api/test/add:
 *   post:
 *     tags: [Tests]
 *     summary: "Add a new test"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Test'
 *     responses:
 *       200:
 *         description: "New test added successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 *
 * @swagger
 * /api/tests/{id}:
 *   get:
 *     tags: [Tests]
 *     summary: "Get a single test by ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Test retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 *
 *   put:
 *     tags: [Tests]
 *     summary: "Update a test by ID"
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
 *             $ref: '#/components/schemas/Test'
 *     responses:
 *       200:
 *         description: "Test updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 *
 *   delete:
 *     tags: [Tests]
 *     summary: "Delete a test by ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Test deleted successfully"
 *
 * components:
 *   schemas:
 *     Test:
 *       type: object
 *       required:
 *         - test_answers
 *         - user
 *       properties:
 *         test_answers:
 *           type: array
 *           items:
 *             type: string
 *           example: ["creative thinking", "teamwork", "problem-solving"]
 *         user:
 *           type: string
 *           description: "ObjectId of the user who took the test"
 *           example: "665aefdbc49b9d1f08b173e1"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: "Test creation timestamp"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: "Test last update timestamp"
 */

// GET all tests
router.get("/tests", async (req, res) => {
  try {
    const tests = await Tests.find().populate("user");
    res.status(200).json(tests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ADD test
router.post("/test/add", async (req, res) => {
  try {
    const { test_answers, user } = req.body;
    if (!Array.isArray(test_answers) || !user) {
      return res
        .status(400)
        .json({ message: "test_answers and user are required." });
    }

    const newTest = new Tests({
      test_answers,
      user,
    });
    await newTest.save();
    res.status(200).json(newTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating test" });
  }
});

// GET test by ID
router.get("/tests/:id", async (req, res) => {
  try {
    const testId = _.get(req, "params.id");
    if (!testId) {
      return res.status(400).json({ message: "ID not provided" });
    }
    const test = await Tests.findById(testId).populate("user");
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.status(200).json(test);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching test" });
  }
});

// UPDATE test
router.put("/test/:id", async (req, res) => {
  try {
    const testId = _.get(req, "params.id");
    const { test_answers, user } = req.body;
    const updated = await Tests.findByIdAndUpdate(
      testId,
      { test_answers, user },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating test" });
  }
});

// DELETE test
router.delete("/tests/:id", async (req, res) => {
  try {
    const testId = _.get(req, "params.id");
    if (!testId) {
      return res.status(400).json({ message: `ID required.` });
    }
    await Tests.findByIdAndDelete(testId);
    res.status(200).json({ message: `${testId} was deleted` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting test" });
  }
});

module.exports = router;
