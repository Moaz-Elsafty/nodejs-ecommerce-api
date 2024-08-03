const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");

dotenv.config({ path: "./config.env" });
const ApiError = require("./utlis/apiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");

// Routes
const mountRoutes = require("./routes");

//connect with db
dbConnection();

//seting up express app
const app = express();

// Enable other domains to access my application
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

//parsing the request body to json
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

//Mount Routes
mountRoutes(app);

//creating error and send it to error handling middleware
app.all("*", (req, res, next) => {
  // const err = new Error(`Can't find this route: ${req.originalUrl}`)
  // next(err.message)
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

//Handling rejections outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
