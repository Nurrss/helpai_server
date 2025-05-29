const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logsDir = "/tmp/logs"; // Папка для логов в tmp (только для записи в read-only окружениях)

const logEvents = async (message, fileName) => {
  const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(logsDir)) {
      await fsPromises.mkdir(logsDir, { recursive: true });
    }

    await fsPromises.appendFile(path.join(logsDir, fileName), logItem);
  } catch (err) {
    console.error("Ошибка записи логов:", err);
  }
};

const logger = (req, res, next) => {
  logEvents(
    `${req.method}\t${req.url}\t${req.headers.origin || "no-origin"}`,
    "reqLog.log"
  );
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logEvents, logger };
