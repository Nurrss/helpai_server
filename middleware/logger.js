const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

// Функция для записи логов в файл с таймстампом и уникальным ID
const logEvents = async (message, fileName) => {
  const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    const logsDir = path.join(__dirname, "..", "logs");
    // Проверяем, существует ли папка logs, если нет - создаём
    if (!fs.existsSync(logsDir)) {
      await fsPromises.mkdir(logsDir);
    }

    // Добавляем сообщение в файл
    await fsPromises.appendFile(path.join(logsDir, fileName), logItem);
  } catch (err) {
    console.error("Ошибка записи логов:", err);
  }
};

// Express middleware для логирования каждого HTTP запроса
const logger = (req, res, next) => {
  logEvents(
    `${req.method}\t${req.url}\t${req.headers.origin || "no-origin"}`,
    "reqLog.log"
  );
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logEvents, logger };
