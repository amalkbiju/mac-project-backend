var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
const MongoDB = require("./src/services/mongodb.service");
const authentication = require("./src/routes/authentication");
const products = require("./src/routes/product");
const errorHandler = require("./middleware/error-handler");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
MongoDB.connectToMongoDB();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "*",
  require("./src/services/authentication.service").tokenVerification
);

app.use("/", indexRouter);
app.use("/v1/auth", authentication);
app.use("/v1/product", products);
app.use(errorHandler);
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

module.exports = app;
