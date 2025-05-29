const router = require("express").Router();

const handleLogin = require("../controllers/authController");
const handleRefreshToken = require("../controllers/authRefreshTokenController");

/**
 * @swagger
 * /api/auth:
 *   post:
 *     tags: [Auth]
 *     summary: "Login with Telegram ID and password"
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
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token
 *                 userId:
 *                   type: string
 *                 role:
 *                   type: string
 *                 teacherId:
 *                   type: string
 *                   nullable: true
 *                 success:
 *                   type: boolean
 *               example:
 *                 accessToken: "generatedAccessToken"
 *                 refreshToken: "generatedRefreshToken"
 *                 userId: "665b2cfedcbaaf10c5c963f0"
 *                 role: "teacher"
 *                 teacherId: "665b2cfedcbaaf10c5c963f2"
 *                 success: true
 *       403:
 *         description: "Incorrect password"
 *       404:
 *         description: "User not found"
 *
 * @swagger
 * /api/auth/refreshToken:
 *   post:
 *     tags: [Auth]
 *     summary: "Refresh access token"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenInput'
 *     responses:
 *       200:
 *         description: "New tokens issued"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 success:
 *                   type: boolean
 *               example:
 *                 accessToken: "newAccessToken"
 *                 refreshToken: "newRefreshToken"
 *                 success: true
 *       401:
 *         description: "Invalid or expired refresh token"
 *
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       required:
 *         - telegram_id
 *         - password
 *       properties:
 *         telegram_id:
 *           type: number
 *           example: 123456789
 *         password:
 *           type: string
 *           example: mySecret123
 *     RefreshTokenInput:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           example: existingRefreshToken
 */

router.post("/", handleLogin);
router.post("/refreshToken", handleRefreshToken);

module.exports = router;
