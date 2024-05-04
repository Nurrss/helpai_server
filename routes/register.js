const router = require("express").Router();

const handleNewUser = require("../controllers/registerController");

/**
 * @swagger
 * /register:
 *   post:
 *     tags: [Authentication]
 *     summary: "Register a new user"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: "User email address"
 *                 required: true
 *               password:
 *                 type: string
 *                 description: "User password"
 *                 required: true
 *               role:
 *                 type: string
 *                 description: "User role"
 *                 required: false
 *                 default: "user"
 *           examples:
 *             newUser:
 *               value:
 *                 email: "test@example.com"
 *                 password: "yourSecurePassword"
 *                 role: "user"
 *     responses:
 *       200:
 *         description: "User registered successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 _id:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *             example:
 *               email: "test@example.com"
 *               role: "user"
 *               _id: "507f1f77bcf86cd799439011"
 *               createdAt: "2020-01-01T00:00:00.000Z"
 *               updatedAt: "2020-01-01T00:00:00.000Z"
 *       400:
 *         description: "Bad request, validation failed"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *             example:
 *               message: "Email is required."
 *               success: false
 *       500:
 *         description: "Internal server error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Error description"
 */

router.post("/", handleNewUser);

module.exports = router;
