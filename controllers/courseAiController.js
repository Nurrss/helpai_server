require("dotenv").config();
const OpenAI = require("openai");
const Courses = require("../models/Courses");
const Lessons = require("../models/Lessons");
const Professions = require("../models/Professions");

const openai = new OpenAI({ apiKey: process.env.API_KEY });

const generateCoursesByProfessionsLogic = async (professions, lang) => {
  try {
    console.log("here");

    if (
      !professions ||
      !Array.isArray(professions) ||
      professions.length === 0
    ) {
      throw new Error("Invalid profession list");
    }

    const prompt = `
Менде мамандықтардың тізімі бар. Сенің міндетің – әр мамандық үшін бір курс ойлап табу және сол курсқа арналған 3 сабақ ұсыну.
Курс тақырыптары өзекті, пайдалы және мамандыққа нақты байланысты болуы керек.
Сабақтар YouTube видеосына сілтеме арқылы берілуі тиіс.

Жауап құрылымы JSON форматында болсын:

[
  {
    "profession": "Бағдарламашы",
    "course": {
      "title": "Python негіздері",
      "description": "Бағдарламалауды жаңа үйреніп жатқан оқушыларға арналған курс.",
      "durability": "2 апта",
      "lessons": [
        {
          "title": "Python тіліне кіріспе",
          "link": "https://www.youtube.com/watch?v=rfscVS0vtbw",
          "content": "Негізгі синтаксис, айнымалылар, шартты операторлар"
        },
        ...
      ]
    }
  }
]

Мамандықтар тізімі:
${JSON.stringify(professions, null, 2)}

Жауапты міндетті түрде ${lang === "ru" ? "орыс" : "қазақ"} тілінде бер.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4.1",
    });

    const responseText = completion.choices[0].message.content;

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (err) {
      throw new Error("AI JSON форматын дұрыс қайтармады: " + responseText);
    }

    const savedCourses = [];

    for (const item of data) {
      const { profession, course } = item;

      const newCourse = new Courses({
        title: course.title,
        description: course.description,
        durability: course.durability,
        lessons: [],
      });

      await newCourse.save();

      const savedLessons = await Promise.all(
        course.lessons.map(async (lesson) => {
          const newLesson = new Lessons({
            title: lesson.title,
            content: lesson.content,
            link: lesson.link,
            course: newCourse._id,
          });
          await newLesson.save();
          return newLesson._id;
        })
      );

      newCourse.lessons = savedLessons;
      await newCourse.save();

      // 👇 Clean, duplicate-safe course insertion
      await Professions.updateOne(
        { name: profession },
        { $addToSet: { course: newCourse._id } }
      );

      savedCourses.push(newCourse);
    }

    console.log("Курстар сәтті жасалды және сақталды");
    return {
      success: true,
      message: "Курстар сәтті жасалды және сақталды",
      courses: savedCourses,
    };
  } catch (err) {
    console.error("courseAiController error:", err);
    throw err; // Let the calling function handle the error
  }
};

module.exports = {
  generateCoursesByProfessionsLogic,
};
