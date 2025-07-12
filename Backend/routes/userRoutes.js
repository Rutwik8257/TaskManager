const express = require('express');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const router = express.Router();
const { getUsers, getUserById, deleteUser } = require("../controllers/userController");

router.get("/",protect, adminOnly, getUsers);
router.get("/:id", protect, getUserById);

module.exports = router;