const router = require("express").Router();
const _ = require("lodash");

const Professions = require("../models/Professions");

/**
 * @swagger
 * /api/professions:
 *   get:
 *     tags: [Professions]
 *     summary: "Get all professions"
 *     responses:
 *       200:
 *         description: "A list of professions retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Profession'
 *
 * /api/professions/add:
 *   post:
 *     tags: [Professions]
 *     summary: "Add a new profession"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profession'
 *     responses:
 *       200:
 *         description: "New profession added successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profession'
 *
 * /api/professions/{id}:
 *   get:
 *     tags: [Professions]
 *     summary: "Get a single profession by ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Profession retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profession'
 *
 *   put:
 *     tags: [Professions]
 *     summary: "Update a profession by ID"
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
 *             $ref: '#/components/schemas/Profession'
 *     responses:
 *       200:
 *         description: "Profession updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profession'
 *
 *   delete:
 *     tags: [Professions]
 *     summary: "Delete a profession by ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Profession deleted successfully"
 *
 * components:
 *   schemas:
 *     Profession:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "UX Designer"
 *         course:
 *           type: array
 *           items:
 *             type: string
 *           description: "Array of ObjectIds referencing Courses"
 *           example: ["665c4f2ba5215b2e44b817a9"]
 *         roadmap:
 *           type: array
 *           items:
 *             type: string
 *           description: "Steps to follow for this profession"
 *           example: ["1. Кітап оқу", "2. Курс өту", "3. Жобамен жұмыс істеу"]
 */

// GET all professions
router.get("/", async (req, res) => {
  try {
    const professions = await Professions.find().populate("course");
    res.status(200).json(professions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ADD profession
router.post("/add", async (req, res) => {
  try {
    const { name, course } = req.body;
    const newProfession = new Professions({
      name,
      course,
    });
    await newProfession.save();
    res.status(200).json(newProfession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating profession" });
  }
});

// GET profession by ID
router.get("/:id", async (req, res) => {
  try {
    const professionId = _.get(req, "params.id");
    if (!professionId) {
      return res.status(400).json({ message: "ID not provided" });
    }
    const profession = await Professions.findById(professionId).populate(
      "course"
    );
    if (!profession) {
      return res.status(404).json({ message: "Profession not found" });
    }
    res.status(200).json(profession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching profession" });
  }
});

// UPDATE profession
router.put("/:id", async (req, res) => {
  try {
    const professionId = _.get(req, "params.id");
    const { name, course } = req.body;
    const updated = await Professions.findByIdAndUpdate(
      professionId,
      { name, course },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profession" });
  }
});

// DELETE profession
router.delete("/:id", async (req, res) => {
  try {
    const professionId = _.get(req, "params.id");
    if (!professionId) {
      return res.status(400).json({ message: `ID required.` });
    }
    await Professions.findByIdAndDelete(professionId);
    res.status(200).json({ message: `${professionId} was deleted` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting profession" });
  }
});

module.exports = router;
