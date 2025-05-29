const router = require("express").Router();

const handleLogin = require("../controllers/authController");
const handleRefreshToken = require("../controllers/authRefreshTokenController");

/**
 * @swagger
 * /api/auth:
 *   post:
 *     tags: [Auth]
 *     summary: "Login with name and password"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: "Login successful"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 foundUser:
 *                   $ref: '#/components/schemas/User'
 *       403:
 *         description: "Incorrect password"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Incorrect password."
 *                 success:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: "User not found"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User is not found. Invalid login credentials."
 *                 success:
 *                   type: boolean
 *                   example: false
 *
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       required:
 *         - name
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: johndoe
 *         password:
 *           type: string
 *           example: mySecret123
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "665b2cfedcbaaf10c5c963f0"
 *         name:
 *           type: string
 *           example: johndoe
 *         role:
 *           type: string
 *           enum: [user, teacher]
 *         telegram_id:
 *           type: number
 *           example: 123456789
 *         course:
 *           type: string
 *           nullable: true
 *         professions:
 *           type: array
 *           items:
 *             type: string
 *         tests:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

router.post("/", handleLogin);
router.post("/refreshToken", handleRefreshToken);

module.exports = router;
