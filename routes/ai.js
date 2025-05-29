// routes/ai.js
const router = require("express").Router();
require("dotenv").config();
const OpenAI = require("openai");
const Users = require("../models/Users");
const Tests = require("../models/Tests");
const Professions = require("../models/Professions");
const {
  generateCoursesByProfessionsLogic,
} = require("../controllers/courseAiController");

const openai = new OpenAI({ apiKey: process.env.API_KEY });

router.post("/test", async (req, res) => {
  try {
    const { telegram_id, test_answers, lang } = req.body;

    if (!telegram_id || !test_answers || !Array.isArray(test_answers)) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // 1. Найти пользователя
    const user = await Users.findOne({ telegram_id });
    if (!user) {
      return res.status(404).json({
        message:
          "Пользователь не найден. Пожалуйста, сначала зарегистрируйтесь.",
        success: false,
      });
    }

    // 3. Отправить ответы в OpenAI
    const prompt = `Мен саған бір оқушының профориентациялық тесттегі жауаптарын беремін. Жауаптар адамның қызығушылығы, қабілеті, құндылығы, таңдауы және ортасы туралы. 
Сенің міндетің — осы деректер негізінде оқушының профилін жасап, оған сәйкес 3 мамандық ұсыну. 
Жауапты МІНДЕТТІ түрде келесі құрылым бойынша жаз:

1. Қысқаша қорытынды (оқушы туралы сипаттама)
2. Ұсынылатын мамандықтар (JSON форматта сақталатын болуы керек)
3. Тілді анықта

Мысал формат:
{
  "summary": "Оқушы – адамдармен тез тіл табысатын, эмпатиясы жоғары тұлға. Ол кеңес беру, мотивация беру салаларында өз қабілетін көрсете алады.",
  "professions": ["Психолог", "Коуч", "Профориентолог"],
  "lang":"kz"
}

Міне, оқушының жауаптары жауаптар қай тілде жазылған болса сол тілде жауап бер:
${test_answers.join("\n")}
`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4.1",
    });

    const aiText = completion.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message:
          "Ошибка при обработке ответа от AI. Убедитесь, что он в формате JSON.",
        raw: aiText,
      });
    }

    const professionNames = parsed.professions;
    const summary = parsed.summary;

    let result = "";

    if (lang === "ru") {
      result = `${summary} Вам подходят профессии:\n${professionNames.join(
        ", "
      )}`;
    } else {
      result = `${summary} Сізге сәйкес мамандықтар:\n${professionNames.join(
        ", "
      )}`;
    }

    // 4. Сохранить профессии в базу и привязать к пользователю
    const professions = await Promise.all(
      professionNames.map(async (name) => {
        let prof = await Professions.findOne({ name });
        if (!prof) prof = await new Professions({ name }).save();
        return prof._id;
      })
    );

    user.professions = professions;

    // 2. Сохранить тест
    const newTest = new Tests({ user: user._id, test_answers, result });
    await newTest.save();

    user.tests.push(newTest._id);
    await user.save();

    // 5. Ответить боту
    res.status(200).json({
      success: true,
      result,
    });

    const courseGenResult = await generateCoursesByProfessionsLogic(
      professionNames,
      lang
    );
    console.log("Курстар генерацияланды", courseGenResult);
  } catch (error) {
    console.error("AI error:", error);
    return res.status(500).json({ success: false, message: "AI error" });
  }
});

module.exports = router;
