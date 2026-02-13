const express = require("express");
const router = express.Router();

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} = require("../middlewares/verifyToken");

const {
  GetAllAuthors,
  GetOneAuthorByID,
  UpdateOneAuthorByID,
  CreateOneAuthor,
  DeleteOneAuthorByID
} = require("../controllers/authorController");

// router.post("/", verifyTokenAndAdmin, CreateOneAuthor);
// router.get("/", GetAllAuthors);
// router.get("/:id", GetOneAuthorByID);
// router.put("/:id", verifyTokenAndAdmin, UpdateOneAuthorByID);
// router.delete("/:id", verifyTokenAndAdmin, DeleteOneAuthorByID);

router
  .route("/")
  .get(GetAllAuthors)
  .post(verifyTokenAndAdmin, CreateOneAuthor);

router
  .route("/:id")
  .get(GetOneAuthorByID)
  .put(verifyTokenAndAdmin, UpdateOneAuthorByID)
  .delete(verifyTokenAndAdmin, DeleteOneAuthorByID);

module.exports = router;
