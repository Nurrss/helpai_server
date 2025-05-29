const router = require("express").Router();

const handleNewUser = require("../controllers/registerController");

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags: [Auth]
 *     summary: "Register a new user or teacher"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       200:
 *         description: "User registered successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "User created successfully with role: teacher"
 *       400:
 *         description: "Bad request, validation failed"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Telegram ID is required."
 *                 success:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: "Internal server error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong."
 *
 * components:
 *   schemas:
 *     RegisterInput:
 *       type: object
 *       required:
 *         - telegram_id
 *         - password
 *         - role
 *       properties:
 *         telegram_id:
 *           type: number
 *           example: 123456789
 *         password:
 *           type: string
 *           example: mySecretPassword
 *         role:
 *           type: string
 *           enum: [user, teacher]
 *           example: teacher
 *         name:
 *           type: string
 *           example: "Jane Teacher"
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "665aefdbc49b9d1f08b173e1"
 *         telegram_id:
 *           type: number
 *           example: 123456789
 *         role:
 *           type: string
 *           enum: [user, teacher]
 *         name:
 *           type: string
 *         course:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

router.post("/", handleNewUser);

module.exports = router;
