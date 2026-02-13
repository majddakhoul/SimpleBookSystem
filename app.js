// const booksPath = require("./routes/books");
// const authorPath = require("./routes/authors");
// const AuthPath = require("./routes/auth");
// const usersPath = require("./routes/users");

/**
 * To use routes in app.js, two ways:
 * 1. You can do it like this:
 *    const booksPath = require("./routes/books");
 *    app.use("/api/books", booksPath);
 * 2. Or like this:
 *    app.use("/api/books", require("./routes/books"));
 */

const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");

const reqInfo = require("./middlewares/logger");
const { errorHandler, notFound } = require("./middlewares/error");
const connectToDB = require("./config/db");

/**
 * Two ways to use dotenv:
 * 1. const dotenv = require("dotenv"); dotenv.config();
 * 2. require("dotenv").config();
 */
require("dotenv").config();

// Connect to Database
connectToDB();

const app = express();
const PORT = process.env.PORT || 8080;

// Static Folder
app.use(express.static(path.join(__dirname, "images")));

// Middlewares
app.use(express.json());
// Same as above but for URL-encoded forms
app.use(express.urlencoded({ extended: false }));

app.use(reqInfo);
app.set("view engine", "ejs");

// Security Middleware
app.use(helmet()); // Helmet for security headers
app.use(cors());   // Enable CORS for all origins
/**
 * To restrict to specific frontend URL or port:
 * app.use(cors({
 *   origin: "http://localhost:8080"
 * }));
 */

// Routes
app.use("/api/books", require("./routes/books"));
app.use("/api/authors", require("./routes/authors"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/password", require("./routes/password"));
app.use("/api/upload", require("./routes/upload"));

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Basic route for root path
app.get("/", (req, res) => {
  res.send("Welcome to Node.js");
});

// Start Server
app.listen(PORT, () => {
  console.log(
    `Server started successfully on mode: ${process.env.NODE_ENV} at port: ${PORT}`
  );
});
