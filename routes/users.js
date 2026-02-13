const express = require("express");
const router = express.Router();

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} = require("../middlewares/verifyToken");

const {
  GetAllUser,
  GetOneUserByID,
  DeleteOneUserByID,
  UpdateUserInfo
} = require("../controllers/userController");

router.put("/:id", verifyTokenAndAuthorization, UpdateUserInfo);
router.get("/", verifyTokenAndAdmin, GetAllUser);
router.get("/:id", verifyTokenAndAuthorization, GetOneUserByID);
router.delete("/:id", verifyTokenAndAuthorization, DeleteOneUserByID);

module.exports = router;
