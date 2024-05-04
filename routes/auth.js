const router = require("express").Router();

const handleLogin = require("../controllers/authController");
const handleRefreshToken = require("../controllers/authRefreshTokenController");

/**
 * @swagger
 * /auth:
 *   post:
 *     tags: [Authentication]
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's password
 *           examples:
 *             example1:
 *               value:
 *                 email: "user@example.com"
 *                 password: "password123"
 *     responses:
 *       200:
 *         description: Login successful, returns access and refresh tokens
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
 *                 success:
 *                   type: boolean
 *             example:
 *               accessToken: "generatedAccessToken"
 *               refreshToken: "generatedRefreshToken"
 *               success: true
 *       403:
 *         description: Incorrect password
 *       404:
 *         description: User not found
 *
 * @swagger
 * /auth/refreshToken:
 *   post:
 *     tags: [Authentication]
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token to be refreshed
 *           examples:
 *             example1:
 *               value:
 *                 refreshToken: "existingRefreshToken"
 *     responses:
 *       200:
 *         description: Refresh token validated and new tokens generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: New JWT refresh token
 *                 success:
 *                   type: boolean
 *             example:
 *               accessToken: "newAccessToken"
 *               refreshToken: "newRefreshToken"
 *               success: true
 *       401:
 *         description: Invalid or expired refresh token
 */

router.post("/", handleLogin);

router.post("/refreshToken", handleRefreshToken);

module.exports = router;
