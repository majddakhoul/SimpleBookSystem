const { Book } = require("./models/Book");
const { Author } = require("./models/Author");
const { books, authors } = require("./data");
const dotenv = require("dotenv");

dotenv.config();

const connectToDB = require("./config/db");
connectToDB();

// Import Books
const importBooks = async () => {
  try {
    await Book.insertMany(books);
    console.log("Books imported successfully to DB.");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

// Remove all books
const removeBooks = async () => {
  try {
    await Book.deleteMany();
    console.log("Books removed successfully from DB.");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

// Import Authors
const importAuthors = async () => {
  try {
    await Author.insertMany(authors);
    console.log("Authors imported successfully to DB.");
    process.exit(1);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

// Remove all authors
const removeAuthors = async () => {
  try {
    await Author.deleteMany();
    console.log("Authors removed successfully from DB.");
    process.exit(1);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

// Command line arguments to trigger import/remove
if (process.argv[2] === "-import-books") {
  importBooks();
} else if (process.argv[2] === "-remove-books") {
  removeBooks();
} else if (process.argv[2] === "-import-authors") {
  importAuthors();
} else if (process.argv[2] === "-remove-authors") {
  removeAuthors();
}
