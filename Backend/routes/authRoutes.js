const express = require("express");
const router = express.Router();
const User = require("../models/User");

const { protect } = require("../middlewares/authMiddleware");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController");
const upload = require("../middlewares/uploadMiddleware");

// AUTH routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// IMAGE UPLOAD route (no protect during sign-up upload)
router.post("/upload-image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  try {
    // If user is logged in (optional enhancement)
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { profileImageUrl: imageUrl });
      return res.status(200).json({
        message: "Image uploaded and profile updated",
        imageUrl,
      });
    }

    // If not logged in — just return image URL for sign-up
    res.status(200).json({
      message: "Image uploaded",
      imageUrl,
    });
  } catch (error) {
    console.error("Error handling uploaded image:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
