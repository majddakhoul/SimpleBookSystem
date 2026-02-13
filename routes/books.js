const express = require("express");
const router = express.Router();

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} = require("../middlewares/verifyToken");

const {
  GetAllBooks,
  UpdateOneBookByID,
  CreateOneBook,
  GetOneBookByID,
  DeleteOneBookByID
} = require("../controllers/bookController");

// router.get("/", GetAllBooks);
// router.get("/:id", GetOneBookByID);
// router.post("/", verifyTokenAndAdmin, CreateOneBook);
// router.put("/:id", verifyTokenAndAdmin, UpdateOneBookByID);
// router.delete("/:id", verifyTokenAndAdmin, DeleteOneBookByID);

// /api/books
router
  .route("/")
  .get(GetAllBooks)
  .post(verifyTokenAndAdmin, CreateOneBook);

// /api/books/:id
router
  .route("/:id")
  .put(verifyTokenAndAdmin, UpdateOneBookByID)
  .get(GetOneBookByID)
  .delete(verifyTokenAndAdmin, DeleteOneBookByID);

module.exports = router;
