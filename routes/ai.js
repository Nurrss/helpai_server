const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const aiController = require("../controllers/aiController");
require("dotenv").config();
const { fetchResultsForSubmission } = require("../controllers/aiController");

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

router.get(
  "/:examId/:submissionId",
  fetchResultsForSubmission,
  async (req, res) => {
    try {
      const results = req.results;

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Ты онлайн логопед. В этом массиве есть правильные слова и поле userInput, которые проговорил ребенок. Тебе нужно сравнить слова и выдать мне общий совет: где у меня ошибка и как исправить ошибку в произношении.\n\n${JSON.stringify(
              results,
              null,
              2
            )}`,
          },
        ],
        model: "gpt-3.5-turbo",
      });

      res
        .status(200)
        .json({ success: true, answer: completion.choices[0].message.content });
    } catch (error) {
      console.error("Error during OpenAI API call:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

module.exports = router;
