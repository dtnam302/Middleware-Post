const bodyParser = require("body-parser");
const express = require("express");
const logger = require("morgan");
const mongoClient = require("mongoose");
const multer = require("multer");
//const upload = multer();
const upload = require("./utils/multer");
const dotenv = require("dotenv");
// setup connect mongodb by mongoose
mongoClient
  .connect("mongodb://localhost:27017")
  .then(() => console.log("✅ Connected database from mongodb."))
  .catch((error) =>
    console.error(`❌ Connect database is failed with error which is ${error}`)
  );

const app = express();
dotenv.config();

const deckRoute = require("./routes/deck");
const userRoute = require("./routes/user");
const postRoute = require("./routes/post");

// Middlewares
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(upload.array("image"));

// Routes
app.use("/decks", deckRoute);
app.use("/users", userRoute);
app.use("/post", postRoute);

// Routes
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Server is OK!",
  });
});

// Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler function
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;

  // response to client
  return res.status(status).json({
    error: {
      message: error.message,
    },
  });
});

// Start the server
const port = app.get("port") || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
