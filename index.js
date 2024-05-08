const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/auth");
const adminRoute = require("./routes/admin");
const teacherRoute = require("./routes/teacher");
const userRoute = require("./routes/users");
const QuestionsRoute = require("./routes/questoins");
const publicRoute = require("./routes/public");
const registerRoute = require("./routes/register");
const { logger, logEvents } = require("./middleware/logger");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const port = 3000;

dotenv.config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API",
      version: "1.0.0",
    },
  },
  apis: ["routes/*.js"],
};

mongoose
  .connect(
    "mongodb+srv://nurrsserkul:123123123@cluster0.xylhv0i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

app.use(logger);
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.use(cookieParser());
const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/register", registerRoute);
app.use("/api/auth", authRoute);
app.use("/api/questions", QuestionsRoute);
app.use("/api/admin", adminRoute);
app.use("/api/teacher", teacherRoute);
app.use("/api/public", publicRoute);
app.use("/api/user", userRoute);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(port, () => {
    console.log("Backend server is running at:", port);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});

app.use(function (req, res) {
  return res.status(404).json({ message: "Endpoint not found" });
});
